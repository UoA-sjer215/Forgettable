import databaseOperations from '../../utils/test/db-handler';

import encounterService from '../encounter.service';
import Encounter, { EncounterModel } from '../../models/encounter.model';
import Person, {PersonModel} from '../../models/person.model';

beforeAll(async () => {databaseOperations.connectDatabase()});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());


const person1Data: PersonModel = {
    first_name: 'Ping',
    last_name: 'Pong',
    interests: ['video games', 'hockey'],
    organisation: 'helloc',
    time_updated: new Date('2022-01-01'),
    how_we_met: 'Hockey club',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
    first_met: new Date('2022-01-01'),
    gender: "male",
    location: "Auckland",
    image: null as any,
    social_media: null as any
}

const encounter1Data: EncounterModel = {
    title: "Encounter1",
    date: new Date('2022-02-23'),
    time_updated: new Date(Date.now()),
    description: 'Met at a cafe',
    location: 'Auckland',
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any
}

const encounter2Data: EncounterModel= {
    title: "Encounter4",
    description: 'Play badminton together',
    location: 'Auckland',
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
    time_updated: new Date(Date.now()),
    date: null as any
}

const encounter3Data: EncounterModel = {
    title: "Encounter5",
    date: new Date('2022-05-25'),
    time_updated: new Date(Date.now()),
    description: 'Played badminton together',
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
    location: null as any
}

const encounter4Data: EncounterModel = {
    title: null as any,
    date: new Date('2019-08-17'),
    time_updated: new Date(Date.now()),
    description: 'Shopping',
    location: 'Auckland',
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
}

const encounter5Data: EncounterModel = {
    title: "Encounter7",
    date: new Date('2022-05-25'),
    time_updated: new Date(Date.now()),
    location: 'Auckland',
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
    description: null as any
}

const encounter6Data: EncounterModel = {
    title: "Encounter8",
    date: new Date('2022-05-25'),
    time_updated: new Date(Date.now()),
    location: 'Auckland',
    persons: null as any,
    description: "This is encounter 8" as any
}

const encounter7Data: EncounterModel = {
    title: "Encounter9",
    date: new Date('2022-05-25'),
    time_updated: new Date(Date.now()),
    location: 'Auckland',
    persons: [] as any,
    description: "This is encounter 9" as any
}

const encounter8Data: EncounterModel = {
    title: "Encounter1",
    date: new Date('2022-02-23'),
    time_updated: new Date(Date.now()),
    description: 'Met at a cafe',
    location: 'Auckland',
    persons: ["656e636f756e746572314964"] as any
}

const encounter9Data: EncounterModel = {
    title: "Encounter1",
    date: new Date('2022-02-23'),
    time_updated: new Date(Date.now()),
    description: 'Met at a cafe',
    location: 'Auckland',
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any
}

describe('Encounter creation service', () => {

    it('Successfully stores encounter if all required fields are given',  async () => {
        await encounterService.createEncounter(encounter1Data);
    })

    it('Successfully stores user if date field is missing', async () => {
        await encounterService.createEncounter(encounter2Data);
    })

    it('Successfully stores user if location field is missing', async () => {
        await encounterService.createEncounter(encounter3Data);
    })

    it('All user info are stored correctly', async () => {
        const encounter1 = await encounterService.createEncounter(encounter1Data);
        const encounter2 = await encounterService.createEncounter(encounter2Data);
        const encounter3 = await encounterService.createEncounter(encounter3Data);

        const storedEncounter1 = await Encounter.findOne({_id: encounter1._id}).exec();
        const storedEncounter2 = await Encounter.findOne({_id: encounter2._id}).exec();
        const storedEncounter3 = await Encounter.findOne({_id: encounter3._id}).exec();

        expect(encounter1.toJSON()).toEqual(storedEncounter1?.toJSON());
        expect(encounter2.toJSON()).toEqual(storedEncounter2?.toJSON());
        expect(encounter3.toJSON()).toEqual(storedEncounter3?.toJSON());
    })

    it('Failed to store user without title', async () => {
        await expect(encounterService.createEncounter(encounter4Data)).rejects.toThrow('Encounter validation failed: title: Path `title` is required.');
    })

    it('Failed to create new user without description', async () => {
        await expect(encounterService.createEncounter(encounter5Data)).rejects.toThrow('Encounter validation failed: description: Path `description` is required.');

    })

    it('Failed to create new user without persons', async () => {
        await expect(encounterService.createEncounter(encounter6Data)).rejects.toThrow('Encounter validation failed: persons: Path `persons` is required.');

    })

    it('Failed to create new user with empty persons', async () => {
        await expect(encounterService.createEncounter(encounter7Data)).rejects.toThrow('Persons can\'t be empty');
    })
})

describe('Delete Encounter Service', () => {
    it('Successfully deletes encounter with valid ID',  async () => {
        const encounterOne = new Encounter(encounter8Data);
        const encounterOneId = (await encounterOne.save())._id;

        expect(await encounterService.deleteEncounter(String(encounterOneId))).toBe(true);
    })


    it('Returns false with deletion of encounter with non-valid ID', async () => {
        expect(await encounterService.deleteEncounter("123123123123")).toBe(false);
    })
})

describe('Delete Encounter Persons Service', () => {
    it('Successfully deletes person from a single person encounter', async () => {
        const encounterOne = new Encounter(encounter8Data);
        const encounterOneId = (await encounterOne.save())._id;

        const result = await encounterService.deleteEncounterPerson("656e636f756e746572314964");
        expect(await result["array"][0]?._id).toEqual(encounterOneId);
        expect(await result["bool"]).toBe(true);
    })

    it('Successfully deletes person from a multiple person encounter', async () => {
        const encounterOne = new Encounter(encounter9Data);
 
        const result = await encounterService.deleteEncounterPerson("656e636f756e746572314964");
        expect(await result["array"]).toEqual([]);
        expect(await result["bool"]).toBe(true);
    })
})
