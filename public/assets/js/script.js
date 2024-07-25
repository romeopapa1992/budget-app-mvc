document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            alert('Signup successful!');
            window.location.href = '/signin';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/signin', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            alert('Signin successful!');
            window.location.href = '/dashboard';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('incomeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/income', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            alert('Income recorded!');
            window.location.reload();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/expense', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            alert('Expense recorded!');
            window.location.reload();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
