
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const checkout = async (req, res) => {
    const { products } = req.body;
    console.log(products);
    const lineItems = products?.map((product) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: product?.productId?.title,
                images: [product?.productId?.images[0]?.url],
            },
            unit_amount: Math.round(product?.price * 100),
        },
        quantity: product?.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/fail',
    });
    console.log(session.payment_status);
    res.json({ id: session.id });
}

const paymentVerification = async (req, res) => {
    const { session_id } = req.body;

    try {
        console.log('Received session_id:', session_id);

        // Ensure session_id is a string
        if (!session_id || typeof session_id !== 'string') {
            throw new Error('Invalid session_id');
        }

        // Retrieve the checkout session
        const checkout_session = await stripe.checkout.sessions.retrieve(session_id);

        // Log and send the payment status
        console.log('Payment status:', checkout_session.payment_status);
        res.json({ payment_status: checkout_session.payment_status });
    } catch (error) {
        console.error('Error during payment verification:', error.message);
        res.status(500).json({ error: error.message });
    }
};



module.exports = { checkout, paymentVerification };