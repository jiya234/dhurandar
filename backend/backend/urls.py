from django.contrib import admin
from django.urls import path, include
from users.views import researcher_list, add_researcher

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/researcher/<int:pk>/', researcher_list, name='researcher-by-user'),
    path('api/researcher/add/', add_researcher, name='researcher-add'),
]
