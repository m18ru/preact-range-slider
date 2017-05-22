import classJoin from 'classjoin';
import {Component, h} from 'preact';

/**
 * Component Properties.
 */
export interface HandleProps
{
	/** Vertical mode? */
	vertical: boolean;
	/** Control disabled? */
	disabled: boolean;
	/** Currently dragged? */
	dragging: boolean;
	/** Minimum value */
	min: number;
	/** Maximum value */
	max: number;
	/** Current value */
	value: number;
	/** Handle index */
	index: number;
	/** Handle offset, % */
	offset: number;
	/** Prefix for class names */
	classesPrefix: string;
	/** Tip content */
	children?: JSX.Element[];
}

/**
 * Component State.
 */
export interface HandleState
{
	[key: string]: void;
}

/**
 * Range handle.
 */
class Handle extends Component<HandleProps, HandleState>
{
	private elementRef: HTMLElement;
	
	/**
	 * Render component.
	 */
	public render(
		{
			min, max, value, vertical, disabled, dragging, index, offset,
			classesPrefix, children,
		}: HandleProps,
	): JSX.Element
	{
		const style: Partial<CSSStyleDeclaration> = (
			vertical
			? {
				bottom: offset + '%',
			}
			: {
				left: offset + '%',
			}
		);
		
		if ( dragging && this.elementRef )
		{
			this.elementRef.focus();
		}
		
		const classes = classJoin(
			{
				[classesPrefix + 'dragging']: dragging,
			},
			[
				classesPrefix + 'handle',
				`${classesPrefix}handle-${index}`,
			],
		);
		
		return (
			<div
				class={classes}
				style={style}
				role="slider"
				tabIndex={disabled ? undefined : 0}
				aria-orientation={vertical ? 'vertical' : 'horizontal'}
				aria-disabled={String( disabled )}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				ref={this.saveElement}
			>
				<span class={classesPrefix + 'tip'}>
					{children}
				</span>
			</div>
		);
	}
	
	/**
	 * Save reference to element in DOM.
	 */
	private saveElement = ( element: HTMLElement ): void =>
	{
		this.elementRef = element;
	}
}

/**
 * Module.
 */
export {
	Handle as default,
	// HandleProps,
	// HandleState,
};
