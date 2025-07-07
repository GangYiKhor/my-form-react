import HomePage from './HomePage';
import ComingSoonPage from './pages/ComingSoonPage';
import FormAsDisplayPage from './pages/FormAsDisplayPage';
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
import CustomInputPage from './pages/inputs/CustomInputPage';
import DateInputPage from './pages/inputs/datetime/DateInputPage';
import DateRangePage from './pages/inputs/datetime/DateRangePage';
import DateTimeInputPage from './pages/inputs/datetime/DateTimePage';
import MonthInputPage from './pages/inputs/datetime/MonthInputPage';
import TimeInputPage from './pages/inputs/datetime/TimeInputPage';
import WeekInputPage from './pages/inputs/datetime/WeekInputPage';
import InputOverviewPage from './pages/inputs/InputOverviewPage';
import ColumnComboBoxPage from './pages/inputs/selections/ColumnComboBoxPage';
import ComboBoxPage from './pages/inputs/selections/ComboBoxPage';
import MultiComboBoxPage from './pages/inputs/selections/MultiComboBoxPage';
import SelectInputPage from './pages/inputs/selections/SelectInputPage';
import SimpleComboBoxPage from './pages/inputs/selections/SimpleComboBoxPage';
import LabelPage from './pages/LabelPage';
import LayoutPage from './pages/LayoutPage';
import SubFormPage from './pages/SubFormPage';

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
					{ title: 'Date Input', path: '/inputs/date', element: DateInputPage },
					{ title: 'Date Time Input', path: '/inputs/datetime', element: DateTimeInputPage },
					{ title: 'Time Input', path: '/inputs/time', element: TimeInputPage },
					{ title: 'Month Input', path: '/inputs/month', element: MonthInputPage },
					{ title: 'Week Input', path: '/inputs/week', element: WeekInputPage },
					{ title: 'Date Range Input', path: '/inputs/date-range', element: DateRangePage },
				],
			},
			{
				title: 'Selection Inputs',
				pages: [
					{ title: 'Select Input', path: '/inputs/select', element: SelectInputPage },
					{ title: 'Simple Combo Box', path: '/inputs/simple-combobox', element: SimpleComboBoxPage },
					{ title: 'Combo Box', path: '/inputs/combobox', element: ComboBoxPage },
					{ title: 'Column Combo Box', path: '/inputs/column-combobox', element: ColumnComboBoxPage },
					{ title: 'Multi Combo Box', path: '/inputs/multi-combobox', element: MultiComboBoxPage },
				],
			},
			{ title: 'Custom Input', path: '/custom-input', element: CustomInputPage },
		],
	},
	{
		title: 'Hooks',
		pages: [
			{ title: 'useMyForm', path: '/use-my-form', element: ComingSoonPage },
			{ title: 'useMyFullForm', path: '/use-my-full-form', element: ComingSoonPage },
			{
				title: 'Form Operations',
				pages: [
					{ title: 'Initialise Form', path: '/initialise-form', element: ComingSoonPage },
					{ title: 'Reset Form', path: '/reset-form', element: ComingSoonPage },
					{ title: 'Clear Form', path: '/clear-form', element: ComingSoonPage },
					{ title: 'Empty Form', path: '/empty-form', element: ComingSoonPage },
					{ title: 'Delete Form', path: '/delete-form', element: ComingSoonPage },
					{ title: 'Validate Form', path: '/validate-form', element: ComingSoonPage },
					{ title: 'Get Form Data', path: '/get-form-data', element: ComingSoonPage },
					{ title: 'Get Form Valid', path: '/get-form-valid', element: ComingSoonPage },
				],
			},
			{
				title: 'Field Operations',
				pages: [
					{ title: 'Update Field', path: '/update-field', element: ComingSoonPage },
					{ title: 'Validate Field', path: '/validate-field', element: ComingSoonPage },
					{ title: 'Delete Field', path: '/delete-field', element: ComingSoonPage },
				],
			},
			{
				title: 'Others',
				pages: [
					{ title: 'formData', path: '/form-data', element: ComingSoonPage },
					{ title: 'formProperties', path: '/form-properties', element: ComingSoonPage },
					{ title: 'setFieldProperties', path: '/set-field-properties', element: ComingSoonPage },
				],
			},
		],
	},
	{
		title: 'More usage',
		pages: [
			{ title: 'Sub Form', path: '/sub-form', element: SubFormPage },
			{ title: 'Form as Display', path: '/form-as-display', element: FormAsDisplayPage },
		],
	},
];
