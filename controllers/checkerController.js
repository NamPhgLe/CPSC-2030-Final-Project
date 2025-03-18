const multer = require('multer');
const path = require('path');

//Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// Initialize multer
const upload = multer({ storage: storage });

// Upload resume file
const getResumeData = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No resume file uploaded' });
        }

        return res.status(200).json({
            message: 'Resume uploaded successfully!',
            filePath: req.file.path, 
        });
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
//get file name 
const getFileName = () => {
    const uploadsDir = path.join(__dirname, 'uploads'); // Path to the uploads folder
    
    // Read the files in the uploads directory
    const files = fs.readdirSync(uploadsDir);
    
    if (files.length === 0) {
        throw new Error('No files found in the uploads directory');
    }

    // Get the first file in the directory
    return files[0];
};

// API parser
const checkResume = async (req, res) => {
    try {
        // const fileName = getFileName();  
        const uploadedFileUrl = `https://writing.colostate.edu/guides/documents/resume/functionalsample.pdf`; 

        var myHeaders = new Headers();
        myHeaders.append("apikey", "Dp2UZOsT8ZFjdr3kQjvy8LWctC84xced");

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
        };

        const response = await fetch(`https://api.apilayer.com/resume_parser/url?url=${uploadedFileUrl}`, requestOptions);

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Error fetching resume data: ${response.statusText} - ${errorDetails}`);
        }

        const result = await response.text(); 

        res.status(200).json({
            message: 'Resume parsed successfully!',
            parsedData: result 
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    getResumeData,
    upload,
    checkResume
}