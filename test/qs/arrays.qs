def Page main
	Applications a

	TileStripSmall ts
		itemSource: {{a.apps.slice(3)}}

	TileStripSmall ts2
		itemSource: {{a.apps[0]}}

	TileStripSmall ts3
		itemSource: {{[a.apps[0],a.apps[1]]}}

	DATA d0
        a: 1
            b: 2