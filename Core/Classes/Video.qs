@example: Video player with controls
  ```qs
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
  ```

@info: Rectangle area displaying video clips. This component uses the standard HTML5 video element. Video source is defined by the //value// property.
@ns: UI.Controls
def UIComponent Video

    @info: Current playback position, in seconds
    public Number time

    @info: Duration of the current clip, in seconds
    public Number duration

    @info: Current sound volume, ranging from //0// to //100//
    public Number volume

    @info: Visibility flag of all controls in the video area
    public Boolean controls: false

    @info: Mute sound flag. Set //true// to mute the video and //false// to turn the sound on.
    public Boolean muted: false

    @info: Full screen mode flag. Set //true// to expand the video to the full screen and //false// to restore its original size.
    public Boolean fullscreen

    @info: If the Video component is created with this flag on, the playback starts automatically
    public Boolean autoplay

    @info: Source of the video, must be a valid URL
    public String value

    @info: Start playing video
    public Function play

    @info: Stop playing video
    public Function stop

    @info: Pause video
    public Function pause
