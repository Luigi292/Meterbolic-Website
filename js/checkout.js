// Complete checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout script loaded');

    // Product data
    const products = {
        baseline: {
            name: 'Baseline',
            description: 'The health check everyone should do.',
            price: 89,
            collectionMethods: {
                'finger-prick': { name: 'Finger prick', price: 0 },
                'tasso': { name: 'Tasso', price: 20 }
            }
        },
        response: {
            name: 'Meterbolic Response',
            description: 'The full picture of how your body handles food.',
            price: 179,
            collectionMethods: {
                'finger-prick': { name: 'Finger prick', price: 0 },
                'tasso': { name: 'Tasso', price: 60 }
            }
        }
    };

    let selectedProduct = null;
    let selectedMethod = null;

    // Initialize the checkout
    initializeCheckout();

    function initializeCheckout() {
        console.log('Initializing checkout...');
        
        // Show only step 1 initially
        showStep('step1');
        
        // Initialize step 1
        initializeStep1();
    }

    function showStep(stepId) {
        // Hide all steps
        document.querySelectorAll('.checkout-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show the requested step
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
            stepElement.classList.add('active');
            console.log('Showing step:', stepId);
            
            // Show/hide stripe notice in right panel
            const stripeNotice = document.querySelector('.stripe-notice');
            if (stripeNotice) {
                if (stepId === 'step3-delivery') {
                    stripeNotice.style.display = 'block';
                } else {
                    stripeNotice.style.display = 'none';
                }
            }
        }
    }

    function initializeStep1() {
        console.log('Initializing Step 1');
        
        // Add click listeners to product cards
        const productCards = document.querySelectorAll('#step1 .product-card');
        console.log('Found product cards:', productCards.length);
        
        productCards.forEach(card => {
            card.addEventListener('click', function() {
                console.log('Product card clicked:', this.getAttribute('data-product'));
                const productType = this.getAttribute('data-product');
                
                // Remove selected class from all cards
                productCards.forEach(c => c.classList.remove('selected'));
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Store selected product
                selectedProduct = products[productType];
                
                // Update right panel
                updateProductDisplay();
                
                // Update hidden form fields
                updateFormFields();
                
                // Enable next button
                const nextBtn = document.getElementById('nextBtnStep1');
                if (nextBtn) {
                    nextBtn.disabled = false;
                    console.log('Enabled next button');
                }
            });
        });
        
        // Next button functionality for step 1
        const nextBtnStep1 = document.getElementById('nextBtnStep1');
        if (nextBtnStep1) {
            nextBtnStep1.addEventListener('click', function() {
                console.log('Next button step 1 clicked');
                if (selectedProduct) {
                    proceedToStep2();
                } else {
                    alert('Please select a product first.');
                }
            });
        }

        // Back button functionality for step 1 - goes to index.html
        const backBtnStep1 = document.getElementById('backBtnStep1');
        if (backBtnStep1) {
            backBtnStep1.addEventListener('click', function() {
                console.log('Back button clicked - going to index.html');
                window.location.href = 'index.html';
            });
        }

        console.log('Step 1 initialized successfully');
    }

    function proceedToStep2() {
        console.log('Proceeding to step 2 with product:', selectedProduct.name);
        
        if (selectedProduct.name === 'Baseline') {
            showStep('step2-baseline');
            initializeStep2('baseline');
        } else {
            showStep('step2-response');
            initializeStep2('response');
        }
    }

    function initializeStep2(productType) {
        console.log('Initializing Step 2 for:', productType);
        
        const step2Id = productType === 'baseline' ? 'step2-baseline' : 'step2-response';
        const backBtnId = productType === 'baseline' ? 'backToStep1Baseline' : 'backToStep1Response';
        const nextBtnId = productType === 'baseline' ? 'nextBtnStep2Baseline' : 'nextBtnStep2Response';
        
        const methodCards = document.querySelectorAll(`#${step2Id} .blood-collection`);
        console.log('Found method cards:', methodCards.length);
        
        // Reset method selection
        selectedMethod = null;
        updateMethodDisplay();
        updateTotalDisplay();
        
        // Add click listeners to method cards
        methodCards.forEach(card => {
            card.addEventListener('click', function() {
                console.log('Method card clicked:', this.getAttribute('data-method'));
                const method = this.getAttribute('data-method');
                const price = parseInt(this.getAttribute('data-price'));
                
                // Remove selected class from all method cards in this step
                methodCards.forEach(c => c.classList.remove('selected'));
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Store selected method
                selectedMethod = { 
                    method, 
                    price, 
                    name: method === 'finger-prick' ? 'Finger prick' : 'Tasso' 
                };
                
                console.log('Selected method:', selectedMethod);
                
                // Update right panel
                updateMethodDisplay();
                updateTotalDisplay();
                
                // Update hidden form fields
                updateFormFields();
                
                // Enable next button for step 2
                const nextBtnStep2 = document.getElementById(nextBtnId);
                if (nextBtnStep2) {
                    nextBtnStep2.disabled = false;
                    console.log('Enabled step 2 next button');
                }
            });
        });
        
        // Back button functionality for step 2 - goes back to step 1
        const backBtn = document.getElementById(backBtnId);
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                console.log('Back button clicked - going to step 1');
                showStep('step1');
                selectedMethod = null;
                updateMethodDisplay();
                updateTotalDisplay();
                updateFormFields();
            });
        }
        
        // Next button functionality for step 2
        const nextBtnStep2 = document.getElementById(nextBtnId);
        if (nextBtnStep2) {
            nextBtnStep2.addEventListener('click', function() {
                console.log('Step 2 next button clicked');
                if (selectedMethod) {
                    proceedToStep3();
                } else {
                    alert('Please select a blood collection method to continue.');
                }
            });
        }
        
        console.log('Step 2 initialized successfully');
    }

    function proceedToStep3() {
        console.log('Proceeding to step 3 - Delivery Details');
        showStep('step3-delivery');
        initializeStep3();
    }

    function initializeStep3() {
        console.log('Initializing Step 3');
        
        // Back button functionality for step 3 - goes back to appropriate step 2
        const backBtnStep3 = document.getElementById('backToStep2');
        if (backBtnStep3) {
            backBtnStep3.addEventListener('click', function() {
                console.log('Back button clicked - going to step 2');
                if (selectedProduct.name === 'Baseline') {
                    showStep('step2-baseline');
                } else {
                    showStep('step2-response');
                }
            });
        }
        
        // Form submission is now handled by the HTML form directly
        // The submit button will trigger the form submission to send-checkout.php
        
        console.log('Step 3 initialized successfully');
    }
    
    function validateDeliveryForm() {
        const requiredFields = [
            'firstName',
            'lastName', 
            'postcode',
            'address',
            'houseNumber',
            'town',
            'email',
            'phone'
        ];
        
        let isValid = true;
        let missingFields = [];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                isValid = false;
                missingFields.push(fieldId);
            }
        });
        
        const privacyCheckbox = document.getElementById('privacy');
        if (!privacyCheckbox.checked) {
            isValid = false;
            alert('Please accept the Privacy and Cookies Policy to continue.');
            return false;
        }
        
        if (!isValid) {
            alert('Please fill in all required fields marked with *');
            return false;
        }
        
        return true;
    }
    
    function updateProductDisplay() {
        const selectedProductDisplay = document.getElementById('selectedProductDisplay');
        if (selectedProductDisplay && selectedProduct) {
            selectedProductDisplay.innerHTML = `
                <div class="product-selected">
                    <h4>${selectedProduct.name}</h4>
                    <p>${selectedProduct.description}</p>
                    <div class="price">£${selectedProduct.price}</div>
                </div>
            `;
            console.log('Updated product display');
        }
    }
    
    function updateMethodDisplay() {
        const selectedMethodDisplay = document.getElementById('selectedMethodDisplay');
        const methodNameDisplay = document.getElementById('methodName');
        const methodPriceDisplay = document.getElementById('methodPriceDisplay');
        
        if (selectedMethod && selectedMethodDisplay && methodNameDisplay && methodPriceDisplay) {
            methodNameDisplay.textContent = selectedMethod.name;
            methodPriceDisplay.textContent = `£${selectedMethod.price}`;
            selectedMethodDisplay.style.display = 'block';
            console.log('Updated method display');
        } else {
            if (selectedMethodDisplay) {
                selectedMethodDisplay.style.display = 'none';
            }
        }
    }
    
    function updateTotalDisplay() {
        const totalPriceDisplay = document.getElementById('totalPriceDisplay');
        const totalAmountDisplay = document.getElementById('totalAmountDisplay');
        
        if (selectedProduct && selectedMethod && totalPriceDisplay && totalAmountDisplay) {
            const totalPrice = selectedProduct.price + selectedMethod.price;
            totalAmountDisplay.textContent = `£${totalPrice}`;
            totalPriceDisplay.style.display = 'block';
            console.log('Updated total display:', totalPrice);
        } else {
            if (totalPriceDisplay) {
                totalPriceDisplay.style.display = 'none';
            }
        }
    }
    
    // NEW FUNCTION: Update hidden form fields for PHP submission
    function updateFormFields() {
        if (selectedProduct) {
            const productType = selectedProduct.name === 'Baseline' ? 'baseline' : 'response';
            document.getElementById('formSelectedProduct').value = productType;
            document.getElementById('formProductPrice').value = selectedProduct.price;
        }
        
        if (selectedMethod) {
            document.getElementById('formSelectedMethod').value = selectedMethod.method;
            document.getElementById('formMethodPrice').value = selectedMethod.price;
        }
        
        if (selectedProduct && selectedMethod) {
            const totalPrice = selectedProduct.price + selectedMethod.price;
            document.getElementById('formTotalAmount').value = `£${totalPrice}`;
        }
        
        console.log('Updated form fields for PHP submission');
    }
    
    function proceedToFinalCheckout() {
        if (!selectedProduct || !selectedMethod) {
            alert('Please complete your selection to continue.');
            return;
        }

        const totalPrice = selectedProduct.price + selectedMethod.price;
        const deliveryFee = 8.50;
        const finalTotal = totalPrice + deliveryFee;
        
        console.log('Proceeding to final checkout with total:', finalTotal);

        // Store in sessionStorage for the next page
        const orderData = {
            product: selectedProduct,
            method: selectedMethod,
            total: totalPrice,
            finalTotal: finalTotal,
            deliveryFee: deliveryFee,
            deliveryDetails: getDeliveryDetails()
        };
        sessionStorage.setItem('selectedOrder', JSON.stringify(orderData));
        
        // Show confirmation and proceed to payment
        const confirmationMessage = `
Selected: ${selectedProduct.name}
Collection Method: ${selectedMethod.name}
Product Price: £${selectedProduct.price}
Method Price: £${selectedMethod.price}
Subtotal: £${totalPrice}
Delivery Fee: £${deliveryFee.toFixed(2)}
Final Total: £${finalTotal.toFixed(2)}

Proceeding to Stripe payment...
        `;
        
        alert(confirmationMessage);
        
        // Uncomment the line below when you have the payment page ready
        // window.location.href = `payment.html`;
    }
    
    function getDeliveryDetails() {
        return {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            postcode: document.getElementById('postcode').value,
            address: document.getElementById('address').value,
            houseNumber: document.getElementById('houseNumber').value,
            town: document.getElementById('town').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            marketing: document.getElementById('marketing').checked,
            privacy: document.getElementById('privacy').checked
        };
    }

    console.log('Checkout fully initialized');
});