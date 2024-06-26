console.log("Hello World");
let current_song = new Audio();
let songs;
let currfolder;
async function getSongs( folder ) {
    console.log(folder)
    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // console.log(element.href)
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        
        <img src="img/music.svg" alt="">
                            <div class="info">
                                <div class="Song_name" >  ${song.replaceAll('%20',' ').replaceAll('.mp3','')}</div>
                                <div class="Song_artist">Song Artist</div>
                            </div>
                            <div class="play">
                                <img src="img/Play.svg" alt="">
                            </div>
        
        </li>`
    }
    
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener('click',element=>{
            // console.log(e.querySelector('.Song_name').innerHTML.trim())
            play_music(e.querySelector('.Song_name').innerHTML.trim())
            document.querySelector(".left").style.left = "-100%"
        })
        // console.log(e.querySelector('.Song_name').innerHTML)
    })
    document.querySelector(".currentsong").innerHTML = "Now Playing - " + currfolder.split("songs/")[1]
    console.log(songs)
    return songs
}

async function displayAlbums(){
    let a = await fetch(`/songs/`)
    let response = await a.text();
    // console.log("displayAlbums() : ")
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a");
    let Cardcontainer = document.querySelector(".CardContainer")
    // let array = Array.from(anchors)
    //     for (let index = 0 ;index < array.length ;index++){
    //         const e = array[index];
    //     }
    let array = Array.from(anchors)
        for ( let index = 0 ;index < array.length ;index++){
            const e = array[index];

            if(e.href.includes("/songs/")){
                // console.log(e)
                let folder = e.href.split("/songs/")[1]
                // console.log(e.href.split("/songs/")[1])
                let a = await fetch(`/songs/${folder}/info.json`)
                let response = await a.json();
                // console.log(response)
                Cardcontainer.innerHTML = Cardcontainer.innerHTML + `<div data-folder = "${response.title}" class="card">
                            <img src="/songs/${folder}/cover.jpg" alt="">
                            <h3>${response.title}</h3>
                            <p>${response.description}</p>
                            <div class="circle-container">
                                <svg class="play-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50%" height="50%">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                            </div>
                        </div>`
            }
        }

        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click",async item =>{
                // console.log(item.currentTarget)
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                play_music(songs[0].split(".mp3")[0])
                document.querySelector(".left").style.left = "0%"
            })
            
        })    
        
}

const play_music = (track)=>{
    current_song.src = `/${currfolder}/`+track+`.mp3`
    // console.log(current_song)
    current_song.play()
    play.src = 'img/pause-1.svg'
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    // document.querySelector(".songtime").innerHTML = "00:00"
    
    // console.log("SONG GETTING PLAYED",current_song.src,currfolder,track)
    if (document.querySelector(".songbar").style.bottom = "-10vh"){
        document.querySelector(".songbar").style.bottom = "0.5vh"
        document.querySelector(".songbar").style.opacity = "1"
    } 
}

async function main() {
    console.log("started")
    await getSongs("songs/liked-songs");
    // console.log(songs);

    displayAlbums()

    function secondsToMinutesAndSeconds(seconds) {
        // Calculate minutes and remaining seconds
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = Math.floor(seconds % 60);
        
        // Format the result
        var formattedResult = minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
        return formattedResult;
    }
    

   
    play.addEventListener('click',()=>{
        // console.log('hello')
        // console.log(current_song.pause)
        if (current_song.paused){
            current_song.play()
            play.src = 'img/pause-1.svg'
        }
        else{
            current_song.pause()
            play.src = 'img/Play.svg'
        }    
    })

    current_song.addEventListener("timeupdate",()=>{
        // console.log(current_song.currentTime,current_song.duration,secondsToMinutesAndSeconds(current_song.currentTime));
        document.getElementById("start").innerHTML = secondsToMinutesAndSeconds(current_song.currentTime);
        document.getElementById("end").innerHTML = secondsToMinutesAndSeconds(current_song.duration) ;
        let a = (current_song.currentTime/current_song.duration)*100;
        // console.log("Left per : ",a);
        // var circle = document.querySelector('.circle'); 
        // circle.style.left = a;
        // document.querySelector('.left-seekbar').style.width = a + '%';
        // document.querySelector('.seekbar').style.width = (100- a) + '%';
        document.querySelector('.circle').style.left = a + '%';
    })

    // document.querySelector(".s").addEventListener("click",e=>{
    //     let percent =( e.offsetX/e.offsetWidth)* 100;
    //     // document.querySelector('.circle').style.right = (100-percent)+ "%";
    //     // current_song.currentTime = ((current_song.duration)*percent)/100

    //     document.querySelector('.left-seekbar').style.width = percent + '%';
    //     document.querySelector('.seekbar').style.width = (100- percent) + '%';
    // })


    document.querySelector(".s").addEventListener("click", e => {
        let target = e.currentTarget;
        let percent = (e.offsetX / target.offsetWidth) * 100;
        
        // Debugging output
        let a = (current_song.currentTime/current_song.duration)*100;
        // console.log(e.offsetX, " ", target.offsetWidth, " ",a);
    
        // Ensure current_song and current_song.duration are valid
        // if (current_song && isFinite(current_song.duration)) {
        //     current_song.currentTime = (current_song.duration * percent) / 100;
        // } else {
        //     console.error("Invalid song duration or song not loaded.");
        // }
        
        current_song.currentTime = (current_song.duration * percent) / 100;
        // document.querySelector('.left-seekbar').style.width = a + '%';
        // document.querySelector('.seekbar').style.width = (100- a) + '%';
        document.querySelector('.circle').style.left = percent + '%';
    });
    
    document.querySelector(".hambuger-icon").addEventListener("click",e =>{
        let size = document.querySelector(".left").style.left
        if (size == "-100%"){
            document.querySelector(".left").style.left = "0%";
        }
        else{
            document.querySelector(".left").style.left = "-100%";
        }    
    })

    document.querySelector(".close").addEventListener("click",e =>{
        let size = document.querySelector(".left").style.left
        if (size == "-100%"){
            document.querySelector(".left").style.left = "0%";
        }
        else{
            document.querySelector(".left").style.left = "-100%";
        }    
    })

    document.querySelector(".previous").addEventListener("click",e => {
        let index = songs.indexOf(current_song.src.split("/").slice(-1)[0])
        if ((index-1) >= 0){
            // console.log(songs[index-1])
            play_music(songs[index-1].split(".mp3")[0])
        }
        else{
            play_music(songs[songs.length-1].split(".mp3")[0])
        }
    })

    document.querySelector(".next").addEventListener("click",e => {
        let index = songs.indexOf(current_song.src.split("/").slice(-1)[0])
        if ((index+1) < songs.length){
            // console.log(songs[index+1])
            play_music(songs[index+1].split(".mp3")[0])
        }
        else{
            play_music(songs[0].split(".mp3")[0])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        current_song.volume = parseInt(e.target.value)/100
    })

    // Array.from(document.getElementsByClassName("card")).forEach(e=>{
    //     e.addEventListener("click",async item =>{
    //         console.log(`songs/${item.currentTarget.dataset.folder}`)
    //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    //         document.querySelector(".left").style.left = "0%"
    //     })
        
    // })
}

main();
