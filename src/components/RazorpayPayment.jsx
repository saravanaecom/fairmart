/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerURL } from '../server/serverUrl';
import { useTheme } from '@mui/material/styles';

export default function RazorpayPayment({ PlaceOrder, OnlinePayment, payableamount, usedwalledamount, Customer }) {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) { 
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };


    const handlePaymentSuccess = async (response) => {
        console.log("razorpay_payment_response:", response);
        const onlinePaymentId = response.razorpay_payment_id;
        sessionStorage.setItem('onlinePStatus', 1);
        sessionStorage.setItem('onlinePaymentId', onlinePaymentId);
        if (onlinePaymentId) {
            await PlaceOrder(1, onlinePaymentId);
        }
    };


    const handlePayment = async () => {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert("Failed to load Razorpay SDK");
            return;
        }

        const amountInPaise = Math.max(0, Math.round(Number(payableamount) * 100));
        const options = {
            key: ServerURL.COMPANY_PAYMENT_RAZ_KEY,
            amount: amountInPaise,
            currency: ServerURL.CURRENCY,
            name: ServerURL.COMPANY_NAME,
            description: ServerURL.COMPANY_ADDRESS,
            image: '../components/logo/logo.png', 
            handler: handlePaymentSuccess, 
            prefill: {
                id: Number(atob(localStorage.getItem("userId"))),
                name: atob(localStorage.getItem("userName")),
                contact: atob(localStorage.getItem("userMobileNo")),
                email: atob(localStorage.getItem("userEmail")),
            },
            notes: {
                address: ServerURL.COMPANY_ADDRESS
            },
            theme: {
                color: theme.palette.basecolorCode.main,
                hide_topbar: false
            }
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    useEffect(() => {
        if (OnlinePayment) {
            handlePayment();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [OnlinePayment]);  
};
