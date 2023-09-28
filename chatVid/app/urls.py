from django.urls import path

from . import views

urlpatterns = [
    # path('',views.home,name='home'),
    path('',views.lobby,name='lobby'),
    path('room/',views.room,name='room'),
    path('get_token/',views.createToken,name='get_token'),
    path('create_member/', views.createMember),
    path('get_member/', views.getMember),
    path('delete_member/', views.deleteMember),
    
]