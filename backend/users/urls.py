from django.urls import path
from .views import SignupView, LoginView, logout_view,admin_dashboard_stats

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
     path('api/admin/stats/', admin_dashboard_stats, name='admin-stats'),
]
