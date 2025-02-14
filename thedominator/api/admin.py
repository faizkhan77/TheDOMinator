from django.contrib import admin

from .models import UserProfile, Team, Room, Message, Invitation, UserSkill

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Team)
admin.site.register(Room)
admin.site.register(Message)
admin.site.register(Invitation)
admin.site.register(UserSkill)
