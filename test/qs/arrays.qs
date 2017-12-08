def Page main
	Applications a

	TileStrip ts
		itemSource: {{a.apps.slice(3)}}

	TileStrip ts2
		itemSource: {{a.apps[0]}}

	TileStrip ts3
		itemSource: {{[a.apps[0],a.apps[1]]}}

	DATA d0
		a: 1
			b: 2