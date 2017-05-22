import classJoin from 'classjoin';
import {h} from 'preact';
import {SliderMarks} from './AbstractSlider';

/**
 * Component Properties.
 */
export interface StepsProps
{
	min: number;
	max: number;
	step: number;
	lowerBound: number;
	upperBound: number;
	marks: SliderMarks;
	dots: boolean;
	included: boolean;
	vertical: boolean;
	classesPrefix: string;
}

/**
 * Dots on the slider.
 */
function Steps(
	{
		min, max, step, lowerBound, upperBound, marks, dots, included, vertical,
		classesPrefix,
	}: StepsProps,
): JSX.Element
{
	const range = max - min;
	
	const elements = calcPoints( marks, dots, step, min, max ).map(
		( point ) =>
		{
			const offset = (Math.abs( point - min ) / range * 100) + '%';
			const style: Partial<CSSStyleDeclaration> = (
				vertical
				? {bottom: offset}
				: {left: offset}
			);
			const active = (
				(
					!included
					&& ( point === upperBound )
				)
				|| (
					included
					&& ( point <= upperBound )
					&& ( point >= lowerBound )
				)
			);
			
			const classes = classJoin(
				{
					[classesPrefix + 'active']: active,
				},
				[classesPrefix + 'dot'],
			);
			
			return (
				<span
					class={classes}
					style={style}
					key={String( point )}
				/>
			);
		},
	);
	
	return (
		<div class={classesPrefix + 'steps'}>
			{elements}
		</div>
	);
}

/**
 * Calc slider points.
 */
function calcPoints( marks: SliderMarks, dots: boolean,
	step: number, min: number, max: number ): number[]
{
	const points = Object.keys( marks ).map( Number );
	
	if ( dots )
	{
		for ( let i = min; i <= max; i = i + step )
		{
			if ( points.indexOf( i ) === -1 )
			{
				points.push( i );
			}
		}
	}
	
	return points;
}

/**
 * Module.
 */
export {
	Steps as default,
	// StepsProps,
};
