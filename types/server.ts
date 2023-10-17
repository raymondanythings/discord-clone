interface WithParam<S extends string> {
	params: {
		[key in S]: string
	}
}
