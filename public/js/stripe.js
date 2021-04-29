const stripe = Stripe('pk_test_51IlQyeIotXfTrT55vv0bCxuIU2XcVwEhnk8MHy3JBTpdxSf9yfBD19cXYt2bkEQdZUqlMcTpInWkNcyr6sKySpsH006wxuL7nv')
import axios from 'axios';
import { showAlert } from './alerts';


export const bookTour = async tourId => {
    try{
    const session = await axios(
       
        `/api/v1/bookings/checkout-session/${tourId}`
       
        )
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })


    }catch(err) {
        showAlert('error', err)
    }
}