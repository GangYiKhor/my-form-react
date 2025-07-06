import HomePage from './HomePage';
import FormPage from './pages/FormPage';
import FormProviderPage from './pages/FormProviderPage';
import CheckboxInputPage from './pages/inputs/basics/CheckboxInputPage';
import ColourInputPage from './pages/inputs/basics/ColourInputPage';
import FileInputPage from './pages/inputs/basics/FileInputPage';
import NumberInputPage from './pages/inputs/basics/NumberInputPage';
import PasswordPage from './pages/inputs/basics/PasswordPage';
import RadioInputPage from './pages/inputs/basics/RadioInputPage';
import TextAreaPage from './pages/inputs/basics/TextAreaPage';
import TextInputPage from './pages/inputs/basics/TextInputPage';
import InputOverviewPage from './pages/inputs/InputOverviewPage';
import LabelPage from './pages/LabelPage';
import LayoutPage from './pages/LayoutPage';

export const routes = [
	{ title: 'Get Started', path: '/', element: HomePage },
	{ title: 'Form Provider', path: '/form-provider', element: FormProviderPage },
	{ title: 'Form', path: '/form', element: FormPage },
	{ title: 'Layout', path: '/layout', element: LayoutPage },
	{ title: 'Label', path: '/label', element: LabelPage },
	{
		title: 'Inputs',
		path: '/inputs',
		element: InputOverviewPage,
		pages: [
			{
				title: 'Basic Inputs',
				pages: [
					{ title: 'Text Inputs', path: '/inputs/text', element: TextInputPage },
					{ title: 'Textarea Input', path: '/inputs/textarea', element: TextAreaPage },
					{ title: 'Password Input', path: '/inputs/password', element: PasswordPage },
					{ title: 'Number Inputs', path: '/inputs/number', element: NumberInputPage },
					{ title: 'Colour Input', path: '/inputs/colour', element: ColourInputPage },
					{ title: 'File Input', path: '/inputs/file', element: FileInputPage },
					{ title: 'Checkbox Input', path: '/inputs/checkbox', element: CheckboxInputPage },
					{ title: 'Radio Input', path: '/inputs/radio', element: RadioInputPage },
				],
			},
			{
				title: 'Date Time Inputs',
				pages: [
					{ title: 'Date Input', path: '/inputs/date', element: HomePage },
					{ title: 'Date Time Input', path: '/inputs/datetime', element: HomePage },
					{ title: 'Time Input', path: '/inputs/time', element: HomePage },
					{ title: 'Month Input', path: '/inputs/month', element: HomePage },
					{ title: 'Week Input', path: '/inputs/week', element: HomePage },
					{ title: 'Date Range Input', path: '/inputs/date-range', element: HomePage },
				],
			},
			{
				title: 'Selection Inputs',
				pages: [
					{ title: 'Select Input', path: '/inputs/select', element: HomePage },
					{ title: 'Simple Combo Box', path: '/inputs/simple-combobox', element: HomePage },
					{ title: 'Combo Box', path: '/inputs/combobox', element: HomePage },
					{ title: 'Column Combo Box', path: '/inputs/column-combobox', element: HomePage },
					{ title: 'Multi Combo Box', path: '/inputs/multi-combobox', element: HomePage },
				],
			},
			{ title: 'Custom Input', path: '/custom-input', element: HomePage },
		],
	},
	{
		title: 'More usage',
		pages: [
			{ title: 'Sub Form', path: '/sub-form', element: HomePage },
			{ title: 'Form as Display', path: '/form-as-display', element: HomePage },
		],
	},
];
