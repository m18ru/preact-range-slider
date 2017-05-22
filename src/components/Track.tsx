import {Component, h} from 'preact';

/**
 * Component Properties.
 */
export interface TrackProps
{
	/** Vertical mode? */
	vertical: boolean;
	/** Continuous value interval? */
	included: boolean;
	/** Track index */
	index: number;
	/** Track offset, % */
	offset: number;
	/** Track length, % */
	length: number;
	/** Prefix for class names */
	classesPrefix: string;
}

/**
 * Component State.
 */
export interface TrackState
{
	[key: string]: void;
}

/**
 * Track line in range.
 */
class Track extends Component<TrackProps, TrackState>
{
	/**
	 * Render component.
	 */
	public render(
		{vertical, included, index, offset, length, classesPrefix}: TrackProps,
	): JSX.Element
	{
		const style: Partial<CSSStyleDeclaration> = {};
		
		if ( !included )
		{
			style.visibility = 'hidden';
		}
		
		if ( vertical )
		{
			style.bottom = offset + '%';
			style.height = length + '%';
		}
		else
		{
			style.left = offset + '%';
			style.width = length + '%';
		}
		
		return (
			<div
				class={`${classesPrefix}track ${classesPrefix}track-${index}`}
				style={style}
			/>
		);
	}
}

/**
 * Module.
 */
export {
	Track as default,
	// TrackProps,
	// TrackState,
};
