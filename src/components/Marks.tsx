import classJoin from 'classjoin';
import {h} from 'preact';
import {SliderMarks} from './AbstractSlider';

/**
 * Component Properties.
 */
export interface MarksProps
{
	min: number;
	max: number;
	lowerBound: number;
	upperBound: number;
	marks: SliderMarks;
	included: boolean;
	vertical: boolean;
	classesPrefix: string;
}

/**
 * Marks on the slider.
 */
function Marks(
	{
		min, max, lowerBound, upperBound, marks, included, vertical,
		classesPrefix,
	}: MarksProps,
): JSX.Element
{
	const marksKeys = Object.keys( marks );
	const marksCount = marksKeys.length;
	const unit = 100 / (marksCount - 1);
	const markWidth = unit * 0.9;
	
	const range = max - min;
	
	const elements = marksKeys.map( Number )
		.sort( (a, b) => a - b )
		.map(
			( point ) =>
			{
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
					[classesPrefix + 'text'],
				);
				
				const style: Partial<CSSStyleDeclaration> = (
					vertical
					? {
						marginBottom: '-50%',
						bottom: ((point - min) / range * 100) + '%',
					}
					: {
						width: markWidth + '%',
						marginLeft: (-markWidth / 2) + '%',
						left: ((point - min) / range * 100) + '%',
					}
				);
				
				const markPoint = marks[point];
				
				return (
					<span
						class={classes}
						style={style}
						key={String( point )}
					>
						{markPoint}
					</span>
				);
			},
		);
	
	return (
		<div class={classesPrefix + 'marks'}>
			{elements}
		</div>
	);
}

/**
 * Module.
 */
export {
	Marks as default,
	// MarksProps,
};
