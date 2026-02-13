import { NextApiRequest, NextApiResponse } from 'next';

// Mock database for demonstration purposes
const websites = [{ id: 1, name: 'Example', url: 'https://example.com' }];

// GET handler to retrieve the list of websites
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(websites);
    } else if (req.method === 'POST') {
        const newWebsite = req.body;
        websites.push(newWebsite);
        res.status(201).json(newWebsite);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}