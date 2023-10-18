import { WithParam } from '@/types/server'
import { redirect } from 'next/navigation'

export interface WithParamAndState<P extends string, S> extends WithParam<P> {
	state: S
}

const CheckParamHOC = <T extends string, S = undefined>(
	Component: (props: WithParamAndState<T, S>) => Promise<React.JSX.Element>,
	key: keyof Parameters<typeof Component>[0]['params'],
	checkFn?: (props: WithParam<T>) => Promise<S>,
) => {
	let state: S
	const CheckParamInnerConpoment = async (
		props: Parameters<typeof Component>[0],
	) => {
		const { params } = props
		if (!params[key]) return redirect('/')

		if (checkFn) {
			state = await checkFn(props)
		}

		return <Component {...props} state={state} />
	}
	return CheckParamInnerConpoment
}

export default CheckParamHOC
