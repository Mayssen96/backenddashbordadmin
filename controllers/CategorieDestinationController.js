import CategorieDestination from '../models/categorieDestinationModel.js';


export function addOnce(req, res) {
    try {
        const { idDestination, idCategorie } = req.body;
        const categorieDestination = new CategorieDestination({ idDestination, idCategorie });
        categorieDestination.save();
        res.status(201).json(categorieDestination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export function getAll(req, res) {
    CategorieDestination.find({})
        .then((docs) => {
            let list = [];
            for (let i = 0; i < docs.length; i++) {
                list.push({
                    id: docs[i]._id,
                    idDestination: docs[i].idDestination,
                    idCategorie: docs[i].idCategorie,

                });
            }
            res.status(200).json(list);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function deleteOnce(req, res) {
    CategorieDestination.findByIdAndDelete(req.params.id)
        .then((doc) => {
            if (doc) {
                res.status(200).json({ message: " CategorieDestination deleted successfully" });
            } else {
                res.status(404).json({ message: " CategorieDestination not found" });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
};

export function getCategoriesByDestination(req, res) {
    const { idDestination } = req.params;

    CategorieDestination.find({ idDestination })
        .populate('idCategorie')
        .then(categorieDestinations => {
            const categories = categorieDestinations.map(cd => cd.idCategorie);
            res.json(categories);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};


export function getDestinationsByCategory(req, res) {
    const { idCategorie } = req.params;

    CategorieDestination.find({ idCategorie })
        .populate('idDestination')
        .then(categorieDestinations => {
            const destinations = categorieDestinations.map(cd => cd.idDestination);
            res.json(destinations);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};



