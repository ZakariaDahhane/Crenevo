import { StatusCodes } from 'http-status-codes';

class CoreController {
    constructor(model, schema, viewFolderName, redirectPath) {
        this.model = model;
        this.schema = schema;
        this.viewFolderName = viewFolderName || `${model.name.toLowerCase()}s`;
        this.redirectPath = redirectPath || `/${this.viewFolderName}`;
    }

                                //GET
    getAll = async (req, res) => {
        try {
            const items = await this.model.findAll();

            res.status(StatusCodes.OK).render(`${this.viewFolderName}/list`, {
                title: `Liste des ${this.model.name}s`,
                items,
            });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: 'Erreur serveur.' });
        }
    }

                                //GETBYID
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);

            if (!item) {
                return res.status(StatusCodes.NOT_FOUND).render('error', { message: 'Élément non trouvé' });
            }

            res.status(StatusCodes.OK).render(`${this.viewFolderName}/detail`, {
                title: `${this.model.name} Détails`,
                item,
            });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: 'Erreur serveur.' });
        }
    }

                                //CREATE
    create = async (req, res) => {
        try {
            if (req.method === 'GET') {
                return res.status(StatusCodes.OK).render(`${this.viewFolderName}/create`, {
                    title: `Créer un ${this.model.name}`,
                    errorMessage: null,
                    oldInput: {}
                });
            }

            const { error, value } = this.schema.validate(req.body);

            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).render(`${this.viewFolderName}/create`, {
                    title: `Créer un ${this.model.name}`,
                    errorMessage: error.details[0].message,
                    oldInput: req.body,
                });
            }

            await this.model.create(value);
            res.redirect(this.redirectPath);
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: 'Erreur serveur.' });
        }
    }

                                //UPDATE
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);

            if (!item) {
                return res.status(StatusCodes.NOT_FOUND).render('error', { message: 'Élément non trouvé' });
            }

            if (req.method === 'GET') {
                return res.status(StatusCodes.OK).render(`${this.viewFolderName}/edit`, {
                    title: `Modifier un ${this.model.name}`,
                    errorMessage: null,
                    oldInput: item,
                });
            }

            const { error, value } = this.schema.validate(req.body);

            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).render(`${this.viewFolderName}/edit`, {
                    title: `Modifier un ${this.model.name}`,
                    errorMessage: error.details[0].message,
                    oldInput: {...req.body, id:item.id}
                });
            }

            await item.update(value);
            res.redirect(this.redirectPath);
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: 'Erreur serveur.' });
        }
    }

                                //DELETE
    deleteItem = async (req, res) => {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);

            if (!item) {
                return res.status(StatusCodes.NOT_FOUND).render('error', { message: 'Élément non trouvé' });
            }

            await item.destroy();
            res.redirect(this.redirectPath);
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: 'Erreur serveur.' });
        }
    }
}

export default CoreController;