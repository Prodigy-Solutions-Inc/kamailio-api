const moment = require('moment');
const registrations = require('../../api/registrations');

class LocationsRepository {
    constructor(uow) {
        this.uow = uow;
    }

    async getAllRegistrations() {
        try {
            return await this.uow._models.Locations
                .query(this.uow._transaction)
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error('Failed to get all registrations');
            throw err;
        }
    }

    async getRegistration(username, domain) {
        try {
            const datetime = moment.utc().add(1, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
            if (domain && domain.length > 0) {
                return await this.uow._models.Locations
                    .query(this.uow._transaction)
                    .where('expires', '>', datetime)
                    .andWhere('username', username)
                    .andWhere('domain', domain)
                    .orderBy('expires', 'desc')
                    .first();
            } else {
                const registration = await this.uow._models.Locations
                    .query(this.uow._transaction)
                    .first();
                this.uow._logger.error(registration);
                return registration;
            }
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to retrieve registration for username: ${username}`);
            throw err;
        }
    }

    /*
    .where('expires', '>', datetime)
    .andWhere('username', username)
    .orderBy('expires', 'desc') 
    */

    async getRegistrationExpiration(username, domain) {
        try {
            if (domain && domain.length > 0) {
                return await this.uow._models.Locations
                    .query(this.uow._transaction)
                    .where('username', username)
                    .andWhere('domain', domain)
                    .orderBy('expires', 'desc')
                    .first()
                    .select('expires');
            } else {
                return await this.uow._models.Locations
                    .query(this.uow._transaction)
                    .where('username', username)
                    .orderBy('expires', 'desc')
                    .first()
                    .select('expires');
            }
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to get registration expiration for username: ${username}`);
            throw err;
        }
    }
}

module.exports = LocationsRepository;