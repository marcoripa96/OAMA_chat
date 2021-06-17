export interface Message {
	username: string;
	content: string;
	xStartPosition?: string;
	yStartPosition?: string;
	timeTranslate?: string;
	timeUpDown?: string;
	toggleAnimation: boolean;
}

export const MESSAGES: Message[] = [
	{
		username: 'Alex',
		content: 'Hello, how are you today?',
		xStartPosition: '1%',
		timeTranslate: '180s',
		timeUpDown: '5s',
		toggleAnimation: true
	},
	{
		username: 'Alice',
		content: 'Are you coming tonight?',
		xStartPosition: '2%',
		yStartPosition: '400%',
		timeTranslate: '80s',
		timeUpDown: '7s',
		toggleAnimation: true
	},
	{
		username: 'Max',
		content: 'Wanna come at the park later?',
		yStartPosition: '250%',
		xStartPosition: '-400px',
		timeTranslate: '105s',
		timeUpDown: '8s',
		toggleAnimation: true
	},
	{
		username: 'Max',
		content: 'yes fine, I\'ll be there',
		yStartPosition: '15%',
		xStartPosition: '500%',
		timeTranslate: '90s',
		timeUpDown: '7s',
		toggleAnimation: true
	},
	{
		username: 'Kayle',
		content: 'It\'s Max\'s birthday today 🎂',
		yStartPosition: '70%',
		xStartPosition: '700%',
		timeTranslate: '50s',
		timeUpDown: '9s',
		toggleAnimation: true
	},
	{
		username: 'Lisa',
		content: 'I\'m so happy for you 🤗',
		yStartPosition: '50%',
		xStartPosition: '-300%',
		timeTranslate: '160s',
		timeUpDown: '9s',
		toggleAnimation: true
	},
	{
		username: 'Christian',
		content: 'I\'m finally done with all the exams',
		yStartPosition: '20%',
		xStartPosition: '200%',
		timeTranslate: '110s',
		timeUpDown: '9s',
		toggleAnimation: true
	},
	{
		username: 'Riccardo',
		content: 'I\'m starting this Arduino project',
		yStartPosition: '25%',
		xStartPosition: '350%',
		timeTranslate: '90s',
		timeUpDown: '17s',
		toggleAnimation: true
	},
	{
		username: 'Gabriele',
		content: 'Machine learning is so fun 🤩',
		yStartPosition: '0',
		xStartPosition: '700%',
		timeTranslate: '120s',
		timeUpDown: '15s',
		toggleAnimation: true
	},
	{
		username: 'Marco',
		content: 'I love Angular',
		yStartPosition: '25%',
		xStartPosition: '-550%',
		timeTranslate: '160s',
		timeUpDown: '17s',
		toggleAnimation: true
	},
	{
		username: 'Ollie',
		content: 'I\'s amazing! Congrats!',
		yStartPosition: '0',
		xStartPosition: '-700%',
		timeTranslate: '190s',
		timeUpDown: '12s',
		toggleAnimation: true
	},
];
