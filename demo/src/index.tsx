import {Component, h, render} from 'preact';
import {MultiSlider, Slider} from '../../src/index';

/**
 * Component Properties.
 */
interface DemoProps
{
	[key: string]: void;
}

/**
 * Component State.
 */
interface DemoState
{
	min: number;
	max: number;
	step: number;
	marks: SliderMarks;
	dots: boolean;
	included: boolean;
	vertical: boolean;
	disabled: boolean;
	defaultValue: number[];
	count: number;
	pushable: boolean | number;
	allowCross: boolean;
}

interface SliderMarks
{
	[key: number]: string;
}

class Demo extends Component<DemoProps, DemoState>
{
	private static onFormSubmit( event: Event ): void
	{
		event.preventDefault();
	}
	
	private static convertMarksToText( marks: SliderMarks ): string
	{
		const keys = Object.keys( marks );
		const parts: string[] = [];
		
		for ( const key of keys )
		{
			parts.push( `${key}: ${marks[key as any]}` );
		}
		
		return parts.join( '\n' );
	}
	
	private static convertTextToMarks( text: string ): SliderMarks
	{
		return text.split( /[\r\n]+/ )
			.map(
				( line ) => line.split( /\s*:\s*/ )
			)
			.reduce(
				( marks, values ) =>
				{
					const num = Number( values[0] );
					
					if ( !isNaN( num ) && values[1] )
					{
						marks[num] = values[1];
					}
					
					return marks;
				},
				{} as SliderMarks,
			);
	}
	
	public constructor( props: DemoProps )
	{
		super( props );
		
		this.state = {
			min: 0,
			max: 100,
			step: 1,
			marks: {
				0: '0 %',
				25: '25 %',
				50: '50 %',
				75: '75 %',
				100: '100 %',
			},
			dots: false,
			included: true,
			vertical: false,
			disabled: false,
			defaultValue: [25, 50, 75],
			count: 2,
			pushable: 5,
			allowCross: true,
		}
	}
	
	/**
	 * Render component.
	 */
	public render(
		_props: DemoProps,
		state: DemoState,
	): JSX.Element
	{
		return (
			<div class="demo">
				<div class="component">
					{
						( state.count < 1 )
						? <Slider {...state as any}/>
						: <MultiSlider {...state} />
					}
				</div>
				<form class="controls" name="controls"
					action="javascript:"
					onChange={this.onFormChange}
					onSubmit={Demo.onFormSubmit}
				>
					<ul>
						<li>
							<input type="checkbox"
								id="f-controls-vertical"
								name="vertical"
								checked={state.vertical}
							/>
							<label for="f-controls-vertical">
								Vertical?
							</label>
						</li>
						<li>
							<input type="checkbox"
								id="f-controls-disabled"
								name="disabled"
								checked={state.disabled}
							/>
							<label for="f-controls-disabled">
								Disabled?
							</label>
						</li>
						<li>
							<input type="checkbox"
								id="f-controls-included"
								name="included"
								checked={state.included}
							/>
							<label for="f-controls-included">
								As continuous value interval (otherwise, as independent values)?
							</label>
						</li>
						<li>
							<input type="checkbox"
								id="f-controls-dots"
								name="dots"
								checked={state.dots}
							/>
							<label for="f-controls-dots">
								Show dots on slider (with step as interval)?
							</label>
						</li>
						<li>
							<input type="checkbox"
								disabled
								checked={state.step > 0}
								title="Set step to “0” to disable."
							/>
							<label for="f-controls-step">
								Slider step, can be disabled (set to zero or less) to make marks as steps:
							</label>
							<input type="number"
								id="f-controls-step"
								name="step"
								step="0.1"
								min="0"
								value={String( state.step )}
							/>
						</li>
						<li>
							<label for="f-controls-min">
								Minimum value:
							</label>
							<input type="number"
								id="f-controls-min"
								name="min"
								step={String( state.step )}
								value={String( state.min )}
							/>
						</li>
						<li>
							<label for="f-controls-max">
								Maximum value:
							</label>
							<input type="number"
								id="f-controls-max"
								name="max"
								step={String( state.step )}
								value={String( state.max )}
							/>
						</li>
						<li>
							<input type="checkbox"
								id="f-controls-count"
								name="count"
								checked={Boolean( state.count )}
							/>
							<label for="f-controls-count">
								Multiple handles?
							</label>
						</li>
						<li>
							<input type="checkbox"
								id="f-controls-allow-cross"
								name="allow-cross"
								checked={state.allowCross}
							/>
							<label for="f-controls-allow-cross">
								Allow handles to cross each other?
							</label>
						</li>
						<li>
							<input type="checkbox"
								disabled
								checked={Boolean( state.pushable )}
								title="Set distance to “0” to disable."
							/>
							<label for="f-controls-pushable">
								Allow pushing of surrounding handles when moving an handle with distance (0 to disable):
							</label>
							<input type="number"
								id="f-controls-pushable"
								name="pushable"
								step={String( state.step )}
								min="0"
								value={String( Number( state.pushable ) )}
							/>
						</li>
						<li>
							<label for="f-controls-marks">
								Marks on the slider:
							</label>
							<textarea
								id="f-controls-marks"
								name="marks"
							>
								{Demo.convertMarksToText( state.marks )}
							</textarea>
						</li>
					</ul>
				</form>
			</div>
		);
	}
	
	private onFormChange = ( event: Event ) =>
	{
		const target = event.target as HTMLInputElement;
		const state = this.state;
		
		switch ( target.name )
		{
			case 'vertical':
				this.setState( {vertical: !state.vertical} );
				break;
			
			case 'disabled':
				this.setState( {disabled: !state.disabled} );
				break;
			
			case 'included':
				this.setState( {included: !state.included} );
				break;
			
			case 'dots':
				this.setState( {dots: !state.dots} );
				break;
			
			case 'allow-cross':
				this.setState( {allowCross: !state.allowCross} );
				break;
			
			case 'pushable':
				this.setState( {pushable: target.valueAsNumber || false} );
				break;
			
			case 'step':
				this.setState( {step: target.valueAsNumber || 0} );
				break;
			
			case 'min':
				this.setState( {min: target.valueAsNumber || 0} );
				break;
			
			case 'max':
				this.setState( {max: target.valueAsNumber || 100} );
				break;
			
			case 'count':
				this.setState( {count: ( state.count < 1 ? 2 : 0 )} );
				break;
				
			case 'marks':
				this.setState( {marks: Demo.convertTextToMarks( target.value )} );
				break;
		}
	}
}

render( <Demo />, document.body );
