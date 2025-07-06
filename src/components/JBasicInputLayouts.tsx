import { MyForm, MyLabel, MyLabelInputPair, MyTextInput, useMyForm } from '../../lib/main';

type FormType = {
	layout: string;
};

export default function JBasicInputLayouts() {
	const form = useMyForm<FormType>('layout_input');

	return (
		<div className="demo-container">
			<h2>Basic Input Layouts</h2>
			<MyForm<FormType> formId={form.formId}>
				<div className="margin-div">
					<MyLabelInputPair margin={5}>
						<MyLabel for="layout-text-1" required>
							Text:
						</MyLabel>
						<MyTextInput id="layout-text-1" name="layout" />
					</MyLabelInputPair>

					<MyLabelInputPair>
						<MyLabel for="layout-text-2" required>
							Text:
						</MyLabel>
						<MyTextInput id="layout-text-2" name="layout" />
					</MyLabelInputPair>
				</div>

				<div className="dark margin-div">
					<MyLabelInputPair arrangement="horizontal">
						<MyLabel for="layout-text-2-1" required>
							Text:
						</MyLabel>
						<MyTextInput id="layout-text-2-1" name="layout" />
					</MyLabelInputPair>

					<MyLabelInputPair arrangement="horizontal">
						<MyLabel for="layout-text-2-2" required>
							Text:
						</MyLabel>
						<MyTextInput id="layout-text-2-2" name="layout" />
					</MyLabelInputPair>
				</div>

				<div className="margin-div">
					<MyLabelInputPair outerBorder>
						<MyLabel for="layout-text-3-1" required>
							Text:
						</MyLabel>
						<MyTextInput id="layout-text-3-1" name="layout" />
					</MyLabelInputPair>

					<MyLabelInputPair outerBorder>
						<MyLabel for="layout-text-3-2" required>
							Text:
						</MyLabel>
						<MyTextInput id="layout-text-3-2" name="layout" />
					</MyLabelInputPair>
				</div>

				<div className="margin-div">
					<MyLabelInputPair outerBorder>
						<MyLabel for="layout-text-4-1" required>
							Text:
						</MyLabel>
						<MyTextInput id="layout-text-4-1" name="layout" placeholder="Empty" noBorder />
					</MyLabelInputPair>

					<MyLabelInputPair outerBorder>
						<MyLabel for="layout-text-4-2" required>
							Text:
						</MyLabel>
						<MyTextInput id="layout-text-4-2" name="layout" placeholder="Empty" noBorder />
					</MyLabelInputPair>
				</div>
			</MyForm>
		</div>
	);
}
