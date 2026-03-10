from django.core.management.base import BaseCommand
from core.models import Category, MenuItem


class Command(BaseCommand):
    help = 'Seed the database with restaurant menu data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding restaurant data...')

        # Categories
        categories_data = [
            {'name': 'Appetizers', 'slug': 'appetizers', 'sort_order': 1},
            {'name': 'Main Courses', 'slug': 'main-courses', 'sort_order': 2},
            {'name': 'Pasta & Risotto', 'slug': 'pasta-risotto', 'sort_order': 3},
            {'name': 'Burgers & Sandwiches', 'slug': 'burgers-sandwiches', 'sort_order': 4},
            {'name': 'Salads', 'slug': 'salads', 'sort_order': 5},
            {'name': 'Desserts', 'slug': 'desserts', 'sort_order': 6},
            {'name': 'Beverages', 'slug': 'beverages', 'sort_order': 7},
        ]

        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat.slug] = cat
            status = 'Created' if created else 'Exists'
            self.stdout.write(f'  {status}: Category "{cat.name}"')

        # Menu Items
        menu_items_data = [
            # Appetizers
            {'category': 'appetizers', 'name': 'Bruschetta', 'description': 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil.', 'price': 8.99, 'prep_time_minutes': 10},
            {'category': 'appetizers', 'name': 'Mozzarella Sticks', 'description': 'Golden fried mozzarella served with marinara sauce.', 'price': 9.49, 'prep_time_minutes': 12},
            {'category': 'appetizers', 'name': 'Garlic Bread', 'description': 'Warm baguette with garlic butter and herbs.', 'price': 6.99, 'prep_time_minutes': 8},
            {'category': 'appetizers', 'name': 'Calamari Fritti', 'description': 'Crispy fried squid rings with lemon aioli.', 'price': 11.99, 'prep_time_minutes': 15},

            # Main Courses
            {'category': 'main-courses', 'name': 'Grilled Ribeye Steak', 'description': '12oz USDA Prime ribeye with roasted vegetables and mashed potatoes.', 'price': 34.99, 'prep_time_minutes': 25},
            {'category': 'main-courses', 'name': 'Pan-Seared Salmon', 'description': 'Atlantic salmon with lemon butter sauce, asparagus, and wild rice.', 'price': 28.99, 'prep_time_minutes': 20},
            {'category': 'main-courses', 'name': 'Chicken Parmesan', 'description': 'Breaded chicken breast with marinara, mozzarella, and spaghetti.', 'price': 22.99, 'prep_time_minutes': 20},
            {'category': 'main-courses', 'name': 'Lamb Chops', 'description': 'Herb-crusted lamb chops with mint jelly and roasted potatoes.', 'price': 32.99, 'prep_time_minutes': 25},

            # Pasta & Risotto
            {'category': 'pasta-risotto', 'name': 'Fettuccine Alfredo', 'description': 'Creamy parmesan sauce with fettuccine pasta and grilled chicken.', 'price': 18.99, 'prep_time_minutes': 18},
            {'category': 'pasta-risotto', 'name': 'Spaghetti Bolognese', 'description': 'Slow-simmered meat sauce over fresh spaghetti.', 'price': 16.99, 'prep_time_minutes': 15},
            {'category': 'pasta-risotto', 'name': 'Mushroom Risotto', 'description': 'Creamy arborio rice with wild mushrooms and truffle oil.', 'price': 19.99, 'prep_time_minutes': 22},

            # Burgers & Sandwiches
            {'category': 'burgers-sandwiches', 'name': 'Classic Cheeseburger', 'description': 'Angus beef patty with cheddar, lettuce, tomato, and special sauce. Served with fries.', 'price': 15.99, 'prep_time_minutes': 15},
            {'category': 'burgers-sandwiches', 'name': 'BBQ Bacon Burger', 'description': 'Smoky BBQ sauce, crispy bacon, onion rings, and cheddar. Served with fries.', 'price': 17.99, 'prep_time_minutes': 18},
            {'category': 'burgers-sandwiches', 'name': 'Club Sandwich', 'description': 'Triple-decker with turkey, bacon, lettuce, tomato, and mayo.', 'price': 14.49, 'prep_time_minutes': 12},

            # Salads
            {'category': 'salads', 'name': 'Caesar Salad', 'description': 'Crisp romaine, parmesan, croutons, and house-made Caesar dressing.', 'price': 12.99, 'prep_time_minutes': 8},
            {'category': 'salads', 'name': 'Greek Salad', 'description': 'Mixed greens, feta, olives, cucumber, tomato, and red onion.', 'price': 13.49, 'prep_time_minutes': 8},

            # Desserts
            {'category': 'desserts', 'name': 'Tiramisu', 'description': 'Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.', 'price': 10.99, 'prep_time_minutes': 5},
            {'category': 'desserts', 'name': 'Chocolate Lava Cake', 'description': 'Warm chocolate cake with a molten center, served with vanilla ice cream.', 'price': 11.99, 'prep_time_minutes': 15},
            {'category': 'desserts', 'name': 'New York Cheesecake', 'description': 'Creamy cheesecake with strawberry compote.', 'price': 9.99, 'prep_time_minutes': 5},

            # Beverages
            {'category': 'beverages', 'name': 'Fresh Orange Juice', 'description': 'Freshly squeezed orange juice.', 'price': 5.99, 'prep_time_minutes': 3},
            {'category': 'beverages', 'name': 'Italian Espresso', 'description': 'Rich, authentic Italian espresso.', 'price': 3.99, 'prep_time_minutes': 3},
            {'category': 'beverages', 'name': 'Lemonade', 'description': 'Homemade lemonade with fresh mint.', 'price': 4.99, 'prep_time_minutes': 3},
            {'category': 'beverages', 'name': 'Iced Tea', 'description': 'Freshly brewed iced tea with lemon.', 'price': 3.49, 'prep_time_minutes': 2},
        ]

        for item_data in menu_items_data:
            cat_slug = item_data.pop('category')
            cat = categories[cat_slug]
            item, created = MenuItem.objects.get_or_create(
                name=item_data['name'],
                defaults={**item_data, 'category': cat}
            )
            status = 'Created' if created else 'Exists'
            self.stdout.write(f'  {status}: "{item.name}" (${item.price})')

        self.stdout.write(self.style.SUCCESS(f'\nDone! {MenuItem.objects.count()} menu items across {Category.objects.count()} categories.'))
