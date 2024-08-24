/* PLZ READ THIS FIRST

Yang harus diganti untuk penggantian tipe email
html_package    : .html files   = Bisa lihat di folder './html_template'
index           : integer       = index yang akan berkolerasi dengan index 'type_of_email' yang nanti di print untuk subject emailnya
recipient_email : string        = email address user yang ingin di-email
recipientData   : json          = {username, kampus : string, calendar, month : value}

*/

import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const html_package = 'SuperExclusive.html'; // Default template file
const index = 2; // Index for the subject line

// 0 (signup), 1 (supercamp), 2 (superexclusive), 3 (superboost)
const type_of_email = [
    'terimakasih telah mendaftar dengan kami!', // Sign-Up
    'terimakasih telah berlangganan dengan SuperCamp', // SuperCamp
    'terimakasih telah berlangganan dengan Super-Exclusive', // Super-Exclusive
    'terimakasih telah berlangganan dengan SuperBoost', // SuperBoost
];

let recipient_email = 'rizacal.mamen@gmail.com'; // Recipient email
let recipientData = {
    username: 'L4mbads',
    kampus: 'MIT (Mbandung Institute of Technology)',
    calendar: null, // Default value, set to null if not needed
    month: null, // Default value, set to null if not needed
    year: null, // Default value, set to null if not needed
    mentor: null, // Default value, set to null if not needed
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to load and customize the template
function loadTemplate(filePath, data) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    let template = fs.readFileSync(filePath, 'utf-8');

    // Replace placeholders with actual data
    for (const key in data) {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    }

    // Conditionally generate and replace the calendar placeholder
    if (data.calendar) {
        template = template.replace('{{calendar}}', data.calendar);
    } else {
        template = template.replace('{{calendar}}', '');
    }

    return template;
}

// Function to generate calendar HTML
function generateCalendar() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Days of the week header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let calendarHtml = '<table border="1" style="border-collapse: collapse; width: 100%;">';

    // Table header
    calendarHtml += '<thead><tr>';
    daysOfWeek.forEach(day => {
        calendarHtml += `<th>${day}</th>`;
    });
    calendarHtml += '</tr></thead>';

    // Table body
    calendarHtml += '<tbody><tr>';

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarHtml += '<td></td>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        if (Math.random() < 0.3) { // 30% chance to circle a date
            calendarHtml += `<td class="highlight">${day}</td>`;
        } else {
            calendarHtml += `<td>${day}</td>`;
        }

        // New row after every week
        if ((day + firstDay) % 7 === 0) {
            calendarHtml += '</tr><tr>';
        }
    }
    
    // Fill remaining cells for the last week if needed
    const remainingCells = 7 - ((daysInMonth + firstDay) % 7);
    for (let i = 0; i < remainingCells && remainingCells < 7; i++) {
        calendarHtml += '<td></td>';
    }

    calendarHtml += '</tr></tbody></table>';
    return calendarHtml;
}

// Function to generate month and year
function generateMonthYear() {
    const startYear = 2024
    const endYear = 2026
    // Generate a random year within the specified range
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;

    // Array of month names
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Generate a random month index
    const monthIndex = Math.floor(Math.random() * months.length);
    const month = months[monthIndex];
    
    return [month, year];
}

function generateMentorName() {
    // Array of names
    const names = [
        'Aulia Rahmayanti','Bintang Saputra','Cakra Kawala','Dewi Murtisari','Eka Gunawan','Farhan Erza','Gita Cantika','Hadi Hanun','Ika Fadilah','Jaya Wirakarsa','Xena Denphilim',
        'Kamil Ridwan','Laila Prisicilla','Mira Nda','Nanda Kertasari','Oki Oktaviana','Putra Lim','Rani Rahmayanti','Sari Roti','M Tariq Noor F','Ulfa Emanuel','Vira Cantika','Yuda Bastian',
        'Zain Maher','Wira Swasta'
    ];

    const namesIndex = Math.floor(Math.random() * names.length);
    const name = names[namesIndex];

    return name;
}

// Conditionally include calendar data
if (index === 1 || index === 2) {
    recipientData.calendar = generateCalendar();
    recipientData.month = generateMonthYear()[0];
    recipientData.year = generateMonthYear()[1];

    if (index==2) {recipientData.mentor = generateMentorName()};
}

const templatePath = path.join(__dirname, 'html_template', html_package);
console.log(`Loading template from: ${templatePath}`);
const customizedHtml = loadTemplate(templatePath, recipientData);

// Configure the transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email address from .env file
        pass: process.env.EMAIL_PASS, // App password from .env file
    },
});

// Mail Options
let mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: recipient_email,
    subject: `Halo ${recipientData.username}, ${type_of_email[index]}`,
    html: customizedHtml,
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.error('Error sending email:', error);
    }
    console.log('Email sent: ' + info.response);
});


/*
To Do:
1. Membuat Template HTML SuperBoost
2. Connect Code dengan Back-end agar bisa ngirim email secara real
*/