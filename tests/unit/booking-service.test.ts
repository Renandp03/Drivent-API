import bookingServices from '@/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';
import httpStatus from 'http-status';

describe('ShowBook',() => {
    it('Should return status 404 when no booking is found',async () => {
        jest.spyOn(bookingRepository,"findBook").mockImplementationOnce(():any => {
            return null
        });

        const user = {id:1}
        const order = bookingServices.showBook(user.id);
        expect(order).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
          })
    });
    
    it('Should return status 200 when booking is found',async () => {
        const user = {id:1}
        
        jest.spyOn(bookingRepository,"findBook").mockImplementationOnce(():any => {
            return {
                id: 1,
                userId: user.id,
                roomId:1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        const order = await bookingServices.showBook(user.id);
        expect(order).toEqual({
            id:1,
            userId:1,
            roomId:1,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        })
        
    });
});

describe('addBook',() => {
    it('should respond with error if user have no enrollment',async () => {
        jest.spyOn(enrollmentRepository,'findWithAddressByUserId').mockImplementationOnce(():any => {
            return undefined
        });
        
        const order = bookingServices.addBook(1,1);
        expect(order).rejects.toEqual({status:403,message:'no enrollment'})
    });

    it('should respond with error if user have no ticket',async () => {
        jest.spyOn(enrollmentRepository,'findWithAddressByUserId').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"Fernando",
                cpf:'12345678910',
                birthday: new Date(),
                phone: "912345678",
                userId:1,
                Address:[],
                createdAt:new Date(),
                updatedAt:new Date()
            }
        });
        jest.spyOn(ticketRepositories,'findTicketByEnrollment').mockImplementationOnce(():any => {
            return undefined
        });
        
        const order = bookingServices.addBook(1,1);
        expect(order).rejects.toEqual({status:403,message:'no ticket'})
    });
});

// describe('changeBook',() => {
//     it('qualquer coisa',async () => {});
// });
