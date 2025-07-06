import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import { MyForm, MyLabel, MyLabelInputPair, MySelectInput, MyTextInput, useMyForm } from '../../../lib/main';

const PLAIN_SAMPLE =
	'' +
	`<MyLabelInputPair>
  <MyLabel for="text-input">Text:</MyLabel>
  <MyTextInput id="text-input" name="text" type="text" />
</MyLabelInputPair>`;

type FormType = {
	arrangement: 'horizontal' | 'vertical';
	outerBorder: boolean;
	fill: boolean;
	margin: number | string;
};

export default function LayoutPage() {
	const form = useMyForm<FormType>('layout_properties');
	const examplePlainRef = useRef<HTMLElement>(null);
	const propData = form.getFormData();
	const [sampleCode, setSampleCode] = useState<string>(PLAIN_SAMPLE);

	useEffect(() => {
		hljs.highlightAll();
	}, []);

	useEffect(() => {
		let sample = PLAIN_SAMPLE;
		const props: string[] = [];
		if (propData.arrangement) props.push(`arrangement="${propData.arrangement}"`);
		if (propData.margin)
			if (typeof propData.margin === 'number') props.push(`margin={${propData.margin}}`);
			else props.push(`margin="${propData.margin}"`);
		if (propData.outerBorder) props.push('outerBorder');
		if (propData.fill) props.push('fill');
		if (props.length) sample = sample.replace('<MyLabelInputPair>', '<MyLabelInputPair ' + props.join(' ') + '>');
		setSampleCode(sample);

		if (examplePlainRef.current) {
			delete examplePlainRef.current.dataset.highlighted;
			hljs.highlightElement(examplePlainRef.current);
		}
	}, [propData]);

	return (
		<div className="wrapper">
			<div className="documentations">
				<section>
					<h1>My Form Layout</h1>
					<p>
						A simple <code>&lt;div&gt;</code> wrapper for common label input pair layout
					</p>
				</section>

				<section className="example">
					<MyForm<FormType> formId="example">
						<MyLabelInputPair
							arrangement={propData.arrangement}
							outerBorder={propData.outerBorder}
							fill={propData.fill ?? false}
							margin={propData.margin}
						>
							<MyLabel for="text-input">Text:</MyLabel>
							<MyTextInput id="text-input" name="text" type="text" />
						</MyLabelInputPair>
					</MyForm>
				</section>

				<section>
					<h2>Code</h2>
					<pre>
						<code ref={examplePlainRef} className="language-typescript">
							{sampleCode}
						</code>
					</pre>
				</section>
			</div>

			<div className="properties scrollbar">
				<section className="property-section">
					<MyForm formId={form.formId}>
						<h2>Properties</h2>
						<ul>
							<li>
								<code className="property-name">arrangement</code>: Arrange label input pair vertically/horizontally
							</li>
							<ul>
								<li>
									<MySelectInput
										id="arrangement"
										name="arrangement"
										placeholder="Vertical (Default)"
										options={[
											{ label: 'Horizontal', value: 'horizontal' },
											{ label: 'Vertical', value: 'vertical' },
										]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">outerBorder</code>: Wrap the label input pair with a border
							</li>
							<ul>
								<li>
									<MySelectInput
										id="outerBorder"
										name="outerBorder"
										placeholder="Disabled (Default)"
										options={[{ label: 'Enabled', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">fill</code>: Fill the container, only affect horizontal arrangement
							</li>
							<ul>
								<li>
									<MySelectInput
										id="fill"
										name="fill"
										placeholder="Disabled (Default)"
										options={[{ label: 'Enabled', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">margin</code>: Margin of the container
							</li>
							<ul>
								<li>
									<MySelectInput<string | number>
										id="margin"
										name="margin"
										placeholder="None (Default)"
										options={[
											{ label: '4 (number)', value: 4 },
											{ label: '4px', value: '4px' },
											{ label: '4px 20px 0 0', value: '4px 20px 0 0' },
										]}
									/>
								</li>
							</ul>
						</ul>
					</MyForm>
				</section>
			</div>
		</div>
	);
}
