@example: Video player with controls
	def Page main

	  VBox

		//This Video plays the 'Toy story' movie.
		//It is reactively linked to custom slider controls instead of native controls of the video player
		Video video
		  width: 500px
		  height: 300px
		  background: black
		  value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
		  autoplay: true
		  time: {{vTimeControl}}
		  volume: {{vVolumeControl}}

		HBox
		  flexDefinition: 60px 60px 100px

		  //These controls are used to pause, resume, and mute the video, respectively
		  Button pause: '| |'
			.click:()->
			  video.pause()
		  Button play: '> >'
			.click:()->
			  video.play()
		  Button mute: 'MUTE'
			.click:()->
			  if(video.muted) {
				video.muted = false
				this.value = 'MUTE'
			  }
			  else {
				video.muted = true
				this.value = 'UNMUTE'
			  }
		br

		Label: 'Playback position'
		  color: #222288
		//This slider controls the video playback position
		Slider vTimeControl: {{video.time}}
		  width: 500px
		  from: 0
		  to: {{video.duration}}
		br

		Label: 'Playback volume'
		  color: #222288
		//This slider controls the video sound volume
		Slider vVolumeControl: 50
		  width: 500px
		  from: 0
		  to: 100



@info: Rectangle area displaying video clips. This component uses the standard HTML5 video element. Video source is defined by the //value// property.\\
@ns: UI.Controls
def UIComponent Video

    @example: Shows the current timestamp
        Video video
          width: 500px
          height: 300px
          background: black
          value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
          controls: true

        Label: time: {{(video.time/60)|0}} min {{(video.time-((video.time/60)|0)*60)|0}} sec

    @info: Current playback position, in seconds. **Number**
    public Number time

    @example: Duration of the video
        Video video
          width: 500px
          height: 300px
          background: black
          value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
          controls: true

        Label: duration: {{video.duration}} sec or {{(video.duration/60)|0}} min {{(video.duration-((video.duration/60)|0)*60)|0}} sec
    @info: Duration of the current clip, in seconds. **Number**
    public Number duration

    @example: Set the volume level
        VBox
            width: 500px
            flexDefinition: 350px 50px 100px
            Video video
              width: 500px
              height: 300px
              background: black
              value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
              controls: true
              volume: {{s1.value}}

            Slider s1: 100
                width: 500
                from: 0
                to: 100
                step: 10
            Label: volume: {{s1.value}}
    @info: Current sound volume, a **Number** ranging from //0// to //100//
    public Number volume

    @example: Shows controls of the videoplayer
        Video video
            width: 500px
            height: 300px
            background: black
            value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
            controls: true
    @info: Visibility of controls in the video area. **Boolean**
    public Boolean controls: false

    @example: Mute the volume of the video
        VBox
            flexDefinition: 100px 350px
            Button vol: 'mute'
                width: 50px
                .click:()->
                    if(video.muted) {
                        video.muted = false;
                    } else {
                        video.muted = true;
                    }

            Video video
              width: 500px
              height: 300px
              background: black
              value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
              controls: true
    @info: Sound muted **Boolean** flag. Set //true// to mute the video and //false// to turn the sound on.
    public Boolean muted: false

    @example: Shows video on fullscreen
        VBox
            flexDefinition: 100px 350px
            Button full: 'fullscreen'
                width: 50px
                .click:()->
                    video.fullscreen = true;


            Video video
              width: 500px
              height: 300px
              background: black
              value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
              controls: true
    @info: Full screen mode **Boolean** flag. Set //true// to expand the video to the full screen and //false// to restore its original size.
    public Boolean fullscreen

    @info: **Boolean** flag. If the Video component is created with this flag on, the playback starts automatically.
    public Boolean autoplay

    @example: Source of the video
        Video video
            width: 500px
            height: 300px
            background: black
            value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
            controls: true
    @info: Source of the video, must be a valid URL.
    public String value

    @example: Start/pause/stop
        VBox
            flexDefinition: 100px 350px
            HBox
                flexDefinition: 290px 290px 290px
                Button pause: '||'
                    width: 50px
                    .click:()->
                      video.pause()
                Button play: '>'
                    width: 50px
                    .click:()->
                      video.play()
                Button stop: '='
                    width: 50px
                    .click:()->
                        video.stop()



            Video video
              width: 500px
              height: 300px
              background: black
              value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
              autoplay: false
    @info: Start playing video
    public Function play

    @example: Start/pause/stop
        VBox
            flexDefinition: 100px 350px
            HBox
                flexDefinition: 290px 290px 290px
                Button pause: '||'
                    width: 50px
                    .click:()->
                        video.pause()
                Button play: '>'
                    width: 50px
                    .click:()->
                        video.play()
                Button stop: '='
                    width: 50px
                    .click:()->
                        video.stop()



            Video video
                width: 500px
                height: 300px
                background: black
                value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
                autoplay: false
    @info: Stop playing video
    public Function stop

    @example: Start/pause/stop
        VBox
            flexDefinition: 100px 350px
            HBox
                flexDefinition: 290px 290px 290px
                Button pause: '||'
                    width: 50px
                    .click:()->
                        video.pause()
                Button play: '>'
                    width: 50px
                    .click:()->
                        video.play()
                Button stop: '='
                    width: 50px
                    .click:()->
                        video.stop()



            Video video
                width: 500px
                height: 300px
                background: black
                value: 'http://www.html5videoplayer.net/videos/toystory.mp4'
                autoplay: false
    @info: Pause video
    public Function pause
