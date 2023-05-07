import bookingServices from '@/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';
import httpStatus from 'http-status';

describe('ShowBook tests',() => {
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

describe('addBook tests',() => {
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

    it('should respond with error if ticket is not paid yet',async () => {
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
            return {
                id:1,
                ticketTypeId:1,
                enrollmentId:1,
                status:'RESERVED',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        const order = bookingServices.addBook(1,1);
        expect(order).rejects.toEqual({status:403,message:'ticket not paid yet'})
    });

    it('should respond with error if ticketType is remote',async () => {
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
            return {
                id:1,
                ticketTypeId:1,
                enrollmentId:1,
                status:'PAID',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(ticketRepositories,'findTicketTipeById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"João da Silva",
                price:245,
                isRemote:true,
                includesHotel:false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        const order = bookingServices.addBook(1,1);
        expect(order).rejects.toEqual({status:403,message:'this is a remote show.'});
    });

    it('should respond with error if ticketType do not includes hotel',async () => {
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
            return {
                id:1,
                ticketTypeId:1,
                enrollmentId:1,
                status:'PAID',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(ticketRepositories,'findTicketTipeById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"João da Silva",
                price:245,
                isRemote:false,
                includesHotel:false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        const order = bookingServices.addBook(1,1);
        expect(order).rejects.toEqual({status:403,message:'this ticket do not includes hotel.'});
    });

    it('should respond with error if room is not found',async () => {
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
            return {
                id:1,
                ticketTypeId:1,
                enrollmentId:1,
                status:'PAID',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(ticketRepositories,'findTicketTipeById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"João da Silva",
                price:245,
                isRemote:false,
                includesHotel:true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(bookingRepository,'findRoomById').mockImplementationOnce(():any => {
            return undefined
        });

        
        const order = bookingServices.addBook(1,1);
        expect(order).rejects.toEqual({status:404,message:'not found error'})
    });

    it('should respond with error if room have no capacity',async () => {
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
            return {
                id:1,
                ticketTypeId:1,
                enrollmentId:1,
                status:'PAID',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(ticketRepositories,'findTicketTipeById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"João da Silva",
                price:245,
                isRemote:false,
                includesHotel:true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(bookingRepository,'findRoomById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"Quarto com banheira",
                capacity:1,
                hotelId:1,
                Booking:[2],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        
        const order = bookingServices.addBook(1,1);
        expect(order).rejects.toEqual({status:403,message:'no capacity'});
    });

    it('should respond with new booking',async () => {
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
            return {
                id:1,
                ticketTypeId:1,
                enrollmentId:1,
                status:'PAID',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(ticketRepositories,'findTicketTipeById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"João da Silva",
                price:245,
                isRemote:false,
                includesHotel:true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(bookingRepository,'findRoomById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"Quarto com banheira",
                capacity:2,
                hotelId:1,
                Booking:[2],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(bookingRepository,'createBook').mockImplementationOnce(():any => {
            return {
                id:1,
                userId:1,
                roomId:1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
  
        const order = await bookingServices.addBook(1,1);
        expect(order).toEqual({
            id:1,
            userId:1,
            roomId:1,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        });
    });
});



describe('changeBook tests',() => {
    it('Should respond with error when booking is not found',async () => {
        jest.spyOn(bookingRepository,'findBook').mockImplementationOnce(():any => {
            return undefined
        });

        const order = bookingServices.changeBook(1,1,1);
        expect(order).rejects.toEqual({status:403, message:'no booking'});
    });

    it('Should respond with error when booking is not found',async () => {
        jest.spyOn(bookingRepository,'findBook').mockImplementationOnce(():any => {
            return {
                id:1,
                userId:1,
                roomId:1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(bookingRepository,'findRoomById').mockImplementationOnce(():any => {
            return undefined
        });

        const order = bookingServices.changeBook(1,1,1);
        expect(order).rejects.toEqual({status:404, message:'not found'});
    });

    it('Should respond with error when room have no capacity',async () => {
        jest.spyOn(bookingRepository,'findBook').mockImplementationOnce(():any => {
            return {
                id:1,
                userId:1,
                roomId:3,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(bookingRepository,'findRoomById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"Quarto com banheira",
                capacity:1,
                hotelId:1,
                Booking:[2],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        const order = bookingServices.changeBook(1,1,1);
        expect(order).rejects.toEqual({status:403, message:'no capacity'});
    });

    it('Should respond with changed booking ',async () => {
        jest.spyOn(bookingRepository,'findBook').mockImplementationOnce(():any => {
            return {
                id:1,
                userId:1,
                roomId:3,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(bookingRepository,'findRoomById').mockImplementationOnce(():any => {
            return {
                id:1,
                name:"Quarto com banheira",
                capacity:2,
                hotelId:1,
                Booking:[2],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        jest.spyOn(bookingRepository,'updateBook').mockImplementationOnce(():any => {
            return {
                id:1,
                userId:1,
                roomId:1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        const order = await bookingServices.changeBook(1,1,1);
        expect(order).toEqual({
            id:1,
            userId:1,
            roomId:1,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)});
    });
});
