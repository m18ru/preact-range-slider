import {SliderMarks} from './components/AbstractSlider';

/**
 * No operation.
 */
function noop( ..._rest: any[] ): void
{
	// No operation
}

/**
 * Clamp value to the range.
 */
function clampValue(
	value: number,
	{min, max}: {min: number, max: number},
): number
{
	if ( value <= min )
	{
		return min;
	}
	
	if ( value >= max )
	{
		return max;
	}
	
	return value;
}

/**
 * Is value out of range?
 */
function isValueOutOfRange(
	value: number,
	{min, max}: {min: number, max: number},
): boolean
{
	return (
		( value < min )
		|| ( value > max )
	);
}

/**
 * Get precision from step.
 */
function getPrecision( step: number ): number
{
	const stepString = step.toString();
	const dotIndex = stepString.indexOf( '.' );
	let precision = 0;
	
	if ( dotIndex !== -1 )
	{
		precision = stepString.length - dotIndex - 1;
	}
	
	return precision;
}

/**
 * Properties required to align value.
 */
export interface AlignValueProps
{
	marks: SliderMarks;
	step: number;
	min: number;
}

/**
 * Get point on slider closest to value.
 */
function getClosestPoint(
	value: number,
	{marks, step, min}: AlignValueProps,
): number
{
	const points = Object.keys( marks ).map( Number );
	
	if (
		( step != null )
		&& ( step > 0 )
	)
	{
		const closestStep = Math.round( (value - min) / step) * step + min;
		points.push( closestStep );
	}
	
	const diffs = points.map(
		( point ) => Math.abs( value - point ),
	);
	
	return (
		points[diffs.indexOf( Math.min( ...diffs ) )]
		|| min
	);
}

/**
 * Align value to available values using step and marks.
 */
function alignValue(
	value: number,
	props: AlignValueProps,
): number
{
	const {step} = props;
	const closestPoint = getClosestPoint( value, props );
	
	return (
		(
			// If step is less or equal 0, value is taken from marks and should
			// not be rounded.
			( step == null )
			|| ( step <= 0 )
		)
		? closestPoint
		: Number(
			closestPoint.toFixed( getPrecision( step ) ),
		)
	);
}

/**
 * Get center position of handle element.
 */
function getHandleCenterPosition( vertical: boolean, handle: Element ): number
{
	const coords = handle.getBoundingClientRect();
	
	return (
		vertical
		? coords.top + ( coords.height / 2 )
		: coords.left + ( coords.width / 2 )
	);
}

/**
 * Get mouse position.
 */
function getMousePosition( vertical: boolean, event: MouseEvent ): number
{
	return ( vertical ? event.clientY : event.pageX );
}

/**
 * Get touch position.
 */
function getTouchPosition( vertical: boolean, event: TouchEvent ): number
{
	return ( vertical ? event.touches[0].clientY : event.touches[0].pageX );
}
/**
 * Is event from handle?
 */
function isEventFromHandle( event: Event, handles: Element[] ): boolean
{
	return (
		handles.some(
			( handle ) => event.target === handle,
		)
	);
}

/**
 * Is touch event is not correct to move handle?
 */
function isNotCorrectTouchEvent( event: TouchEvent ): boolean
{
	return (
		( event.touches.length > 1 )
		|| (
			( event.type.toLowerCase() === 'touchend' )
			&& ( event.touches.length > 0 )
		)
	);
}

/**
 * Prevent and stop event.
 */
function killEvent( event: Event ): void
{
	event.stopPropagation();
	event.preventDefault();
}

/**
 * Module.
 */
export {
	noop,
	clampValue,
	isValueOutOfRange,
	alignValue,
	getHandleCenterPosition,
	getMousePosition,
	getTouchPosition,
	isEventFromHandle,
	isNotCorrectTouchEvent,
	killEvent,
	// AlignValueProps,
};
