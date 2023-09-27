const App_Id='32f225c65f34478f9bbee0e0e68dd341'
const CHANNEL='main'
const TOKEN='007eJxTYDj67OYDQTMtJUPtO3EMK1cxp67dWe41Yb3C1OK1h3JmvipUYDA2SjMyMk02M00zNjExt0izTEpKTTUAQjOLlBRjE8MqBeHUhkBGBmWZLGZGBggE8VkYchMz8xgYABWbHbw='

console.log('connected')

const client=AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let localtracks=[]
let remoteusers={}
let UID

const Join_And_Display=async()=>
{
client.on('user-published',handleUserJoin)


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

Join_And_Display()
