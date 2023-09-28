from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import  random
import time
import json
from .models import RoomMember
from django.views.decorators.csrf import csrf_exempt

def home(request):
    return render(request,'home.html')



def createToken(request):
    appId='32f225c65f34478f9bbee0e0e68dd341'
    appCertificate='92dd985e0ca2495ab21eeae4400d4f2b'
    channelName=request.GET.get('channel')
    uid=random.randint(1,200)
    expirationTime=3600*24
    currentTime=time.time()
    privilegeExpiredTs=currentTime+expirationTime
    role=1
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    
    return JsonResponse({'token':token,'uid':uid},safe=False)
    
        
        
        
    


def lobby(request):
    return render(request,'lobby.html')

def room(request):
    return render(request,'room.html')

@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )

    return JsonResponse({'name':data['name']}, safe=False)


def getMember(request):
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')

    member = RoomMember.objects.get(
        uid=uid,
        room_name=room_name,
    )
    name = member.name
    return JsonResponse({'name':member.name}, safe=False)

@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)