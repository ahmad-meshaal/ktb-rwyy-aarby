import NextApiRequest from 'next';
import NextApiResponse from 'next';
import multer from 'multer';
import nextConnect from 'next-connect';

const upload = multer({ dest: 'uploads/' });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
})

apiRoute.use(upload.single('file'));

apiRoute.post((req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ data: `File uploaded successfully: ${req.file.path}` });
});

export default apiRoute;
