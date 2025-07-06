import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef } from 'react';

const PLAIN_SAMPLE =
	'' +
	`import { useMyInput } from 'my-form-react';

// A custom number input that convert number to word, only for number 0 to 10
function CustomNumberInput({ id, name }: { id: string; name: string }) {
  const field = useMyInput(name);

  const CHOICES = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    field.updateField({ value: CHOICES[parseInt(e.currentTarget.value)] });
  }

  useEffect(() => {
    field.setFieldProperties({ defaultValue: 0, required: false, validator: (value) => value <= 10 });
    return () => {
      field.deleteField();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.deleteField]);  // Depend on deleteField because it only changes when formId / subFormId / name changes

  return <input ref={field.ref} id={id} onChange={onChange} min={0} max={10} />;
}`;

export default function CustomInputPage() {
	const examplePlainRef = useRef<HTMLElement>(null);

	useEffect(() => {
		hljs.highlightAll();
	}, []);

	return (
		<div className="wrapper">
			<div className="documentations">
				<section>
					<h1>Custom Input</h1>
					<p>
						If you wish to build your own input component instead of using the predefined components, there is a{' '}
						<code>useMyInput(name)</code> hook which will help providing all necessary handlers
					</p>
					<ul>
						<li>
							<code className="property-name">ref</code> - Input Ref for the input element
						</li>
						<li>
							<code className="property-name">fieldName</code> - The name of the field, appended with the subFormId if
							any
						</li>
						<li>
							<code className="property-name">fieldData</code> - The data of the field, automatically updated
						</li>
						<li>
							<code className="property-name">fieldValid</code> - The valid status of the field, automatically updated
						</li>
						<li>
							<code className="property-name">fieldInvalidReason</code> - The invalid reason of the field, automatically
							updated
						</li>
						<li>
							<code className="property-name">fieldProperties</code> - The properties of the field, such as
							defaultValue, required and validator
						</li>
						<li>
							<code className="property-name">updateField</code> - Function to update the field data and/or valid status
						</li>
						<li>
							<code className="property-name">deleteField</code> - Function to delete the field from the form, also
							delete the properties
						</li>
						<li>
							<code className="property-name">validateField</code> - Function to set the valid status of the field, if
							no argument passed, will set the field to valid
						</li>
						<li>
							<code className="property-name">setFieldProperties</code> - Function to update the field properties such
							as defaultValue, required and validator
						</li>
					</ul>
				</section>

				<section>
					<h2>Code</h2>
					<pre>
						<code ref={examplePlainRef} className="language-typescript">
							{PLAIN_SAMPLE}
						</code>
					</pre>
				</section>
			</div>
		</div>
	);
}
