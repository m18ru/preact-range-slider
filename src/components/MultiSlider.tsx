import {h} from 'preact';
import {
	alignValue,
	clampValue,
	isValueOutOfRange,
} from '../utils';
import AbstractSlider, {
	AbstractSliderProps,
	AbstractSliderState,
	SliderMarks,
} from './AbstractSlider';
import Handle from './Handle';
import Track from './Track';

/**
 * Component Properties.
 */
export interface MultiSliderProps extends AbstractSliderProps
{
	/** Initial values of handles */
	defaultValue: number[];
	/** Current values of handles */
	value: number[];
	/** How many ranges to render (handles count = count + 1) */
	count: number;
	/** Allow pushing of surrounding handles when moving with this distance */
	pushable: boolean | number;
	/** Allow handles to cross each other? */
	allowCross: boolean;
	/** Triggered before value is start to change (on mouse down, etc) */
	onBeforeChange( value: number[] ): void;
	/** Triggered while the value of Slider changing */
	onChange( value: number[] ): void;
	/** Triggered after slider changes stop (on mouse up, etc) */
	onAfterChange( value: number[] ): void;
}

/**
 * Component State.
 */
export interface MultiSliderState extends AbstractSliderState
{
	handle: number | null;
	recent: number;
	bounds: number[];
}

/**
 * Properties with default values.
 */
export interface MultiSliderDefaultProps extends AbstractSliderProps
{
	count: number;
	pushable: boolean | number;
	allowCross: boolean;
}

/**
 * Cache of slider points.
 */
interface PointsCache
{
	marks: SliderMarks;
	step: number;
	points: number[];
}

/**
 * Slider with multiple handles.
 */
class MultiSlider extends AbstractSlider<Partial<MultiSliderProps>, MultiSliderState>
{
	/**
	 * Default property values.
	 */
	public static defaultProps: Readonly<MultiSliderDefaultProps> = {
		...AbstractSlider.defaultProps,
		count: 1,
		allowCross: true,
		pushable: false,
	};
	
	/**
	 * Cache of slider points.
	 */
	private pointsCache: PointsCache;
	
	/**
	 * Slider with multiple handles.
	 */
	public constructor( props: MultiSliderProps )
	{
		super( props );
		
		const {count, min, max} = props;
		const initialValue = [...Array( count + 1 )].map( () => min );
		
		const values = (
			( props.value != null )
			? props.value
			: (
				( props.defaultValue != null )
				? props.defaultValue
				: initialValue
			)
		);
		const bounds = values.map( ( value ) => this.clampAlignValue( value ) );
		const recent = (
			( bounds[0] === max )
			? 0
			: bounds.length - 1
		);
		
		this.state = {
			handle: null,
			recent,
			bounds,
		};
	}
	
	/**
	 * When component recieve properties.
	 */
	public componentWillReceiveProps( nextProps: MultiSliderProps ): void
	{
		if (
			!(
				( 'value' in nextProps )
				|| ( 'min' in nextProps )
				|| ( 'max' in nextProps )
			)
		)
		{
			return;
		}
		
		const {bounds} = this.state;
		const value = nextProps.value || bounds;
		const nextBounds = value.map(
			( singleValue ) => this.clampAlignValue( singleValue, nextProps ),
		);
		
		if (
			( nextBounds.length === bounds.length )
			&& nextBounds.every(
				( singleValue, index ) => ( singleValue === bounds[index] ),
			)
		)
		{
			return;
		}
		
		this.setState( {bounds: nextBounds} );
		
		if (
			bounds.some(
				( singleValue ) => isValueOutOfRange( singleValue, nextProps ),
			)
		)
		{
			(this.props as MultiSliderProps).onChange( nextBounds );
		}
	}
	
	/**
	 * Render component.
	 */
	public render(
		{
			min, max, vertical, included, disabled, classesPrefix, tipFormatter,
		}: MultiSliderProps,
		{handle, bounds}: MultiSliderState,
	): JSX.Element
	{
		const offsets = bounds.map(
			( value ) => this.calcOffset( value ),
		);
		
		const handles = bounds.map(
			( value, index ) => (
				<Handle
					vertical={vertical}
					disabled={disabled}
					dragging={handle === index}
					min={min}
					max={max}
					value={value}
					index={index + 1}
					offset={offsets[index]}
					classesPrefix={classesPrefix}
					ref={( component ) => this.saveHandle( component, index )}
					key={`handle-${index}`}
				>
					{tipFormatter( value )}
				</Handle>
			),
		);
		
		const tracks = bounds.slice( 0, -1 ).map(
			( _value, index ) =>
			{
				const nextIndex = index + 1;
				
				return (
					<Track
						vertical={vertical}
						included={included}
						index={nextIndex}
						offset={offsets[index]}
						length={offsets[nextIndex] - offsets[index]}
						classesPrefix={classesPrefix}
						key={`track-${index}`}
					/>
				);
			},
		);
		
		return this.renderBase( tracks, handles );
	}
	
	/**
	 * Get current value.
	 */
	protected getValue(): number[]
	{
		return this.state.bounds;
	}
	
	/**
	 * Get lower bound of current interval.
	 */
	protected getLowerBound(): number
	{
		return this.state.bounds[0];
	}
	
	/**
	 * Get upper bound of current interval.
	 */
	protected getUpperBound(): number
	{
		const {bounds} = this.state;
		
		return bounds[bounds.length - 1];
	}
	
	/**
	 * When value changed.
	 */
	protected onChange<TKey extends keyof MultiSliderState>(
		state: Pick<MultiSliderState, TKey>,
	): void
	{
		const props = this.props as MultiSliderProps;
		const isNotControlled = !('value' in props);
		
		if ( isNotControlled )
		{
			this.setState( state );
		}
		else if ( typeof state.handle !== 'undefined' )
		{
			this.setState( {handle: state.handle} );
		}
		
		const data = {...this.state, ...(state as any as MultiSliderState)};
		
		props.onChange( data.bounds );
	}
	
	/**
	 * On mouse/touch start.
	 */
	protected onStart( position: number ): void
	{
		const props = this.props as MultiSliderProps;
		const state = this.state;
		const bounds = this.getValue();
		
		props.onBeforeChange( bounds );
		
		const value = this.calcValueByPos( position );
		
		const closestBound = this.getClosestBound( value );
		const boundNeedMoving = this.getBoundNeedMoving( value, closestBound );
		
		this.setState(
			{
				handle: boundNeedMoving,
				recent: boundNeedMoving,
			},
		);
		
		const prevValue = bounds[boundNeedMoving];
		
		if ( value === prevValue )
		{
			return;
		}
		
		const nextBounds = [...state.bounds];
		nextBounds[boundNeedMoving] = value;
		this.onChange( {bounds: nextBounds} );
	}
	
	/**
	 * On mouse/touch move.
	 */
	protected onMove( position: number ): void
	{
		const props = this.props as MultiSliderProps;
		const state = this.state;
		
		if ( state.handle == null )
		{
			return;
		}
		
		const value = this.calcValueByPos( position );
		const oldValue = state.bounds[state.handle];
		
		if ( value === oldValue )
		{
			return;
		}
		
		const nextBounds = [...state.bounds];
		nextBounds[state.handle] = value;
		
		let nextHandle = state.handle;
		
		if ( props.pushable !== false )
		{
			const originalValue = state.bounds[nextHandle];
			this.pushSurroundingHandles( nextBounds, nextHandle, originalValue );
		}
		else if ( props.allowCross )
		{
			nextBounds.sort( (a, b) => a - b );
			nextHandle = nextBounds.indexOf( value );
		}
		
		this.onChange(
			{
				handle: nextHandle,
				bounds: nextBounds,
			},
		);
	}
	
	/**
	 * On mouse/touch end.
	 */
	protected onEnd(): void
	{
		this.setState( {handle: null} );
	}
	
	/**
	 * Clamp current value to min-max interval on align to available values
	 * using step and marks.
	 */
	protected clampAlignValue(
		value: number,
		nextProps: Partial<MultiSliderProps> = {},
	): number
	{
		const mergedProps = {...this.props, ...nextProps} as MultiSliderProps;
		
		return alignValue(
			this.clampValueToSurroundingHandles(
				clampValue( value, mergedProps ),
				mergedProps,
			),
			mergedProps,
		);
	}
	
	/**
	 * Get index of closes handle.
	 */
	private getClosestBound( value: number ): number
	{
		const {bounds} = this.state;
		let closestBound: number = 0;
		
		for ( let i = 1, n = bounds.length - 1; i < n; i++ )
		{
			if ( value > bounds[i] )
			{
				closestBound = i;
			}
		}
		
		if (
			Math.abs( bounds[closestBound + 1] - value )
			< Math.abs( bounds[closestBound] - value )
		)
		{
			closestBound += 1;
		}
		
		return closestBound;
	}
	
	/**
	 * Get index of handle that should be moved.
	 */
	private getBoundNeedMoving( value: number, closestBound: number ): number
	{
		const {bounds, recent} = this.state;
		
		let boundNeedMoving: number = closestBound;
		
		const nextBound = closestBound + 1;
		const atTheSamePoint = (
			bounds[nextBound] === bounds[closestBound]
		);
		
		if ( atTheSamePoint )
		{
			if ( bounds[recent] === bounds[closestBound] )
			{
				boundNeedMoving = recent;
			}
			else
			{
				boundNeedMoving = nextBound;
			}
			
			if ( value !== bounds[nextBound] )
			{
				boundNeedMoving = (
					( value < bounds[nextBound] )
					? closestBound
					: nextBound
				);
			}
		}
		
		return boundNeedMoving;
	}
	
	/**
	 * Push surrounding handles.
	 */
	private pushSurroundingHandles(
		bounds: number[], handle: number, originalValue: number,
	): void
	{
		// tslint:disable-next-line:no-non-null-assertion
		const threshold = Number( this.props.pushable! );
		const value = bounds[handle];
		
		let direction = 0;
		
		if ( ( bounds[handle + 1] - value ) < threshold )
		{
			// Push to right
			direction = +1;
		}
		
		if ( ( value - bounds[handle - 1] ) < threshold )
		{
			// Push to left
			direction = -1;
		}
		
		if ( direction === 0 )
		{
			return;
		}
		
		const nextHandle = handle + direction;
		const diffToNext = direction * (bounds[nextHandle] - value);
		
		if (
			!this.pushHandle(
				bounds,
				nextHandle,
				direction,
				threshold - diffToNext,
			)
		)
		{
			// Revert to original value if pushing is impossible
			bounds[handle] = originalValue;
		}
	}
	
	/**
	 * Push specific handle.
	 */
	private pushHandle(
		bounds: number[], handle: number, direction: number, amount: number,
	): boolean
	{
		const originalValue = bounds[handle];
		let currentValue = bounds[handle];
		
		while ( (direction * (currentValue - originalValue)) < amount )
		{
			if ( !this.pushHandleOnePoint( bounds, handle, direction ) )
			{
				// Can't push handle enough to create the needed `amount` gap,
				// so we revert its position to the original value.
				bounds[handle] = originalValue;
				
				return false;
			}
			
			currentValue = bounds[handle];
		}
		
		// The handle was pushed enough to create the needed `amount` gap
		
		return true;
	}
	
	/**
	 * Push specific handle by one point.
	 */
	private pushHandleOnePoint(
		bounds: number[], handle: number, direction: number,
	): boolean
	{
		const points = this.getPoints();
		const pointIndex = points.indexOf( bounds[handle] );
		const nextPointIndex = pointIndex + direction;
		
		if (
			( nextPointIndex >= points.length )
			|| ( nextPointIndex < 0 )
		)
		{
			// Reached the minimum or maximum available point, can't push
			// anymore.
			return false;
		}
		
		const nextHandle = handle + direction;
		const nextValue = points[nextPointIndex];
		
		// tslint:disable-next-line:no-non-null-assertion
		const threshold = Number( this.props.pushable! );
		
		const diffToNext = direction * (bounds[nextHandle] - nextValue);
		
		if (
			!this.pushHandle(
				bounds,
				nextHandle,
				direction,
				threshold - diffToNext,
			)
		)
		{
			// Couldn't push next handle, so we won't push this one either
			return false;
		}
		
		// Push the handle
		bounds[handle] = nextValue;
		
		return true;
	}
	
	/**
	 * Returns an array of possible slider points, taking into account both
	 * `marks` and `step`. The result is cached.
	 */
	private getPoints(): number[]
	{
		const {marks, step, min, max} = this.props as MultiSliderProps;
		const cache = this.pointsCache;
		
		if (
			!cache
			|| ( cache.marks !== marks )
			|| ( cache.step !== step )
		)
		{
			const pointsObject = {...marks};
			
			if ( step != null )
			{
				for ( let point = min; point <= max; point += step )
				{
					pointsObject[point] = String( point );
				}
			}
			
			const points = Object.keys( pointsObject ).map( Number );
			
			points.sort( ( a, b ) => a - b );
			this.pointsCache = {marks, step, points};
		}
		
		return this.pointsCache.points;
	}
	
	/**
	 * Clamp value to interval of surrounding handles.
	 */
	private clampValueToSurroundingHandles(
		value: number,
		{allowCross}: {allowCross: boolean},
	): number
	{
		const {handle, bounds} = this.state;
		
		if (
			!allowCross
			&& ( handle != null )
		)
		{
			if (
				( handle > 0 )
				&& ( value <= bounds[handle - 1] )
			)
			{
				return bounds[handle - 1];
			}
			if (
				( handle < (bounds.length - 1) )
				&& ( value >= bounds[handle + 1] )
			)
			{
				return bounds[handle + 1];
			}
		}
		
		return value;
	}
	
}

/**
 * Module.
 */
export {
	MultiSlider as default,
	// MultiSliderProps,
	// MultiSliderState,
	// MultiSliderDefaultProps
};
