import { handleSubmit } from './js/formHandler'

import {plan_now} from "./js/app";
import {tripRequest} from './js/formHandler'
import {resetTrip} from "./js/app";
import {nextPicture} from "./js/app";

import './styles/form.scss'
import './styles/base.scss'
import './styles/header.scss'
import './styles/footer.scss'

console.log(handleSubmit);

export {
    handleSubmit,
	tripRequest,
	nextPicture,
	resetTrip
}
