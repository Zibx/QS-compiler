@nested
@info: The `WebClient` component in QuokkaScript is a more sophisticated and fancy child class of the [HTTPRequest](Core.HTTPRequest) module and also serves to perform interaction with servers. Being compared with its parent, the `WebClient` component has two major advantages. First, it implements the reactive behaviour of the `url` property. That means, if the `url` string is changed, a new server request is instantly sent (this behaviour can be switched off after setting the `enabled` property to `false`). Secondly, the `WebClient` component automates the parsing of a server response in JSON or XML format (see the `content-type` property description). For these two reasons, we recommend you to use `WebClient` instead of the [HTTPRequest](Core.HTTPRequest) in most of your ordinary tasks.

@ns: Core
define HTTPRequest WebClient

    @info:
    example:
    public Boolean enabled


    @info:
    example:
    public String content-type

    @info:
    example:
    public String error

    @info:
    example:
    public String response