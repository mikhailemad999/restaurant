from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.db.models import Sum
from django.contrib.auth import get_user_model
from .models import Category, MenuItem, Order, OrderItem
from .serializers import (
    UserSerializer, RegisterSerializer, CategorySerializer,
    MenuItemSerializer, OrderSerializer
)

User = get_user_model()

class IsStaffOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

class AdminStatsView(APIView):
    permission_classes = [IsStaffOrAdmin]
    
    def get(self, request):
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Count
        from django.db.models.functions import TruncDate

        now = timezone.now()
        seven_days_ago = now - timedelta(days=7)

        total_sales = Order.objects.filter(status='completed').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        orders_count = Order.objects.count()
        avg_order_value = total_sales / orders_count if orders_count > 0 else 0

        # Calculate daily revenue for the last 7 days
        daily_revenue = (
            Order.objects.filter(status='completed', created_at__gte=seven_days_ago)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(revenue=Sum('total_amount'))
            .order_by('date')
        )

        # Format it for Recharts: [{name: 'Mon', revenue: 120}, ...]
        chart_data = []
        for i in range(6, -1, -1):
            day = (now - timedelta(days=i)).date()
            day_revenue = next((item['revenue'] for item in daily_revenue if item['date'] == day), 0)
            chart_data.append({
                'name': day.strftime('%a'), # e.g., 'Mon'
                'revenue': float(day_revenue)
            })

        return Response({
            'total_sales': total_sales,
            'orders_count': orders_count,
            'avg_order_value': round(avg_order_value, 2),
            'revenue_chart': chart_data
        })

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('sort_order')
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsStaffOrAdmin]
        return [permission() for permission in permission_classes]

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        if self.action in ['list', 'retrieve'] and not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_active=True)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsStaffOrAdmin]
        return [permission() for permission in permission_classes]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            if user.is_staff:
                queryset = Order.objects.all().order_by('-created_at')
                status_filter = self.request.query_params.get('status')
                if status_filter:
                    queryset = queryset.filter(status=status_filter)
                return queryset
            return Order.objects.filter(user=user).order_by('-created_at')
        return Order.objects.none() # Guests can't list their orders yet unless we use session logic

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsStaffOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save()
