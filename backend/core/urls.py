from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, CategoryViewSet, MenuItemViewSet, OrderViewSet, AdminStatsView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'menu', MenuItemViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('auth/register/', AuthViewSet.as_view({'post': 'register'}), name='register'),
    path('', include(router.urls)),
]
