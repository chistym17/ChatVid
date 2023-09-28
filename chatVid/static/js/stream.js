const App_Id='32f225c65f34478f9bbee0e0e68dd341'
const CHANNEL='main'
const TOKEN='007eJxTYOgLjfZJXnJi1i+r/yUqDyVCvi/dmdMUL5/1J0qG14V9cZcCg7FRmpGRabKZaZqxiYm5RZplUlJqqgEQmlmkpBibGDYqiqY2BDIytEaqsDAyQCCIz8KQm5iZx8AAABJ+Hag='

console.log('connected')

const client=AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let localtracks=[]
let remoteusers={}
let UID

const Join_And_Display=async()=>
{
client.on('user-published',handleUserJoin)
client.on('user-left',handleUserleft)

UID=await client.join(App_Id,CHANNEL,TOKEN,null)

localtracks=await AgoraRTC.createMicrophoneAndCameraTracks( )


// (``)


let player=` <div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div> 
                        <div class="username-wrapper"><span class="user-name">Dennis Ivanov</span></div>
                    </div>`

document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

localtracks[1].play(`user-${UID}`)

await client.publish([localtracks[0],localtracks[1]])

}


const handleUserJoin=async(user,media_type)=>
{
remoteusers[user.UID]=user
await client.subscribe(user,media_type)

if(media_type==='video')
{
let player=document.getElementById (`user-container-${user.UID}`)
if(!player==null)
player.remove()

}


 player=` <div class="video-container" id="user-container-${user.UID}">
                        <div class="video-player" id="user-${user.UID}"></div> 
                        <div class="username-wrapper"><span class="user-name">Dennis Ivanov</span></div>
                    </div>`


document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)


user.videoTrack.play(`user-${user.UID}`)

if(media_type==='audio')

{
user.audioTrack.play()

}


}

const handleUserleft=async(user)=>{

delete remoteusers[user.UID]
document.getElementById(`user-container-${user.UID}`).remove

}
Join_And_Display()




const leaveStream=async()=>
{
for(let i=0;i<localtracks.length;i++)
{
localtracks[i].stop()
localtracks[i].close()

}
await client.leave()
window.open('/','_self')
}

const toggleCamera=async(e)=>
{
if(localtracks[1].muted)
{
await localtracks[1].setMuted(false)
e.target.style.backgroundColor='#fff'

}
else
{
await localtracks[1].setMuted(true)
e.target.style.backgroundColor='rgb(255, 80, 80, 1)'

}



}

const toggleMic=async(e)=>
{
if(localtracks[0].muted)
{
await localtracks[0].setMuted(false)
e.target.style.backgroundColor='#fff'

}
else
{
await localtracks[0].setMuted(true)
e.target.style.backgroundColor='rgb(255, 80, 80, 1)'

}



}


document.getElementById('leave-btn').addEventListener('click',leaveStream)
document.getElementById('camera-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',toggleMic)
