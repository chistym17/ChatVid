from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import  random
import time


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
    
        
        
        
    

def home(request):
    return render(request,'index.html')


def lobby(request):
    return render(request,'lobby.html')

def room(request):
    return render(request,'room.html')
