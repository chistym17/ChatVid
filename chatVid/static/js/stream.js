

const App_Id='32f225c65f34478f9bbee0e0e68dd341'
const CHANNEL=sessionStorage.getItem('room')
const TOKEN=sessionStorage.getItem('token')

let UID=Number(sessionStorage.getItem('UID'))
let NAME=sessionStorage.getItem('user')


const client=AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let localtracks=[]
let remoteusers={}

const Join_And_Display=async()=>
{
document.getElementById('room-name').innerText=CHANNEL

client.on('user-published',handleUserJoin)
client.on('user-left',handleUserleft)

try{
UID=await client.join(App_Id,CHANNEL,TOKEN,UID)


}
catch(error){

console.error(error)
window.open('/','_self')

}


localtracks=await AgoraRTC.createMicrophoneAndCameraTracks( )

    let member = await createMember()
// (``)


let player=` <div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div> 
 <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
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
  if (player != null){
            player.remove()
        }

}
   let member = await getMember(user)

 player=` <div class="video-container" id="user-container-${user.UID}">
                        <div class="video-player" id="user-${user.UID}"></div> 
   <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
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
document.getElementById(`user-container-${user.UID}`).remove()

}




const leaveStream=async()=>
{
for(let i=0;i<localtracks.length;i++)
{
localtracks[i].stop()
localtracks[i].close()

}
await client.leave()
deleteMember()
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

let createMember = async () => {
    let response = await fetch('/create_member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
    return member
}


let getMember = async (user) => {
    let response = await fetch(`/get_member/?UID=${user.uid}&room_name=${CHANNEL}`)
    let member = await response.json()
    return member
}

let deleteMember = async () => {
    let response = await fetch('/delete_member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
}

window.addEventListener("beforeunload",deleteMember);


Join_And_Display()



document.getElementById('leave-btn').addEventListener('click',leaveStream)
document.getElementById('camera-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',toggleMic)
