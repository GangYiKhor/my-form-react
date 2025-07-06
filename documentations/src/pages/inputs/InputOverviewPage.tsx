import { Link } from 'react-router';
import { routes } from '../../route';

export default function InputOverviewPage() {
	return (
		<div className="wrapper">
			<div className="documentations">
				<section>
					<h1>My Inputs</h1>
					<p>
						All input components in My Form React must be wrapped inside a <code>&lt;MyFormProvider&gt;</code> and a{' '}
						<code>&lt;MyForm&gt;</code> component to function correctly. All predefined inputs will automatically sync
						their values with the form data returned by <code>useMyForm()</code> and <code>useMyFullForm()</code>. Most
						input supports custom validators, and some can be configured to validate immediately on change, rather than
						on submit only.
					</p>
				</section>

				<section className="component-list">
					<h2>Input Components</h2>
					<ul>
						{routes
							.find(({ title }) => title === 'Inputs')!
							.pages!.map(
								({
									title,
									pages,
									path,
								}: {
									title: string;
									pages?: { title: string; path: string }[];
									path?: string;
								}) => {
									const child =
										pages?.map(({ title, path }) => (
											<li key={title}>
												<Link to={path}>{title}</Link>
											</li>
										)) ?? null;

									if (path)
										return (
											<li key={title}>
												<Link to={path}>
													{title}
													{child ? <ul>{child}</ul> : null}
												</Link>
											</li>
										);

									return (
										<li key={title}>
											{title}
											{child ? <ul>{child}</ul> : null}
										</li>
									);
								}
							)}
					</ul>
				</section>
			</div>
		</div>
	);
}
