import user1 from 'src/assets/images/profile/user-1.jpg';
import user2 from 'src/assets/images/profile/user-2.jpg';
import user3 from 'src/assets/images/profile/user-3.jpg';
import user4 from 'src/assets/images/profile/user-4.jpg';
import user5 from 'src/assets/images/profile/user-5.jpg';
import { Chance } from 'chance';
import { http, HttpResponse } from 'msw';
const chance = new Chance();

let CommissionsData = [
  {
    Id: '001',
    Description: 'Bono por servicios descripción',
    Referrals: 1,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '002',
    Description: 'Comisión por referidos descripción',
    Referrals: 5,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '003',
    Description: 'Bono por servicios descripción',
    Referrals: 20,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '004',
    Description: 'Comisión por referidos descripción',
    Referrals: 30,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '005',
    Description: 'Bono por servicios descripción',
    Referrals: 2,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '006',
    Description: 'Comisión por referidos descripción',
    Referrals: 8,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '007',
    Description: 'Bono por servicios descripción',
    Referrals: 15,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '008',
    Description: 'Comisión por referidos descripción',
    Referrals: 12,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '009',
    Description: 'Bono por servicios descripción',
    Referrals: 3,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '010',
    Description: 'Comisión por referidos descripción',
    Referrals: 25,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '011',
    Description: 'Bono por servicios descripción',
    Referrals: 7,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '012',
    Description: 'Comisión por referidos descripción',
    Referrals: 18,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '013',
    Description: 'Bono por servicios descripción',
    Referrals: 4,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '014',
    Description: 'Comisión por referidos descripción',
    Referrals: 22,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '015',
    Description: 'Bono por servicios descripción',
    Referrals: 9,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '016',
    Description: 'Comisión por referidos descripción',
    Referrals: 35,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '017',
    Description: 'Bono por servicios descripción',
    Referrals: 6,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '018',
    Description: 'Comisión por referidos descripción',
    Referrals: 28,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '019',
    Description: 'Bono por servicios descripción',
    Referrals: 11,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
  {
    Id: '020',
    Description: 'Comisión por referidos descripción',
    Referrals: 40,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Referido',
    deleted: false,
  },
  {
    Id: '021',
    Description: 'Bono por servicios descripción',
    Referrals: 14,
    Amount: 'S/ 300.00',
    Date: '02-15-2020',
    Status: 'Exitoso',
    Type: 'Bono',
    deleted: false,
  },
];

export default CommissionsData;

export const CommissionsHandlers = [
  // Mock GET request to retrieve Commissions data
  http.get('/api/data/commissions/CommissionsData', () => {
    try {
      return HttpResponse.json({ status: 200, msg: 'Success', data: CommissionsData });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        error,
      });
    }
  }),

  // Mock DELETE endpoint for deleting a commission
  http.delete('/api/data/commissions/delete', async ({ request }) => {
    try {
      const { id } = await request.json();
      const commissions = CommissionsData.map((commission) =>
        commission.Id === id ? { ...commission, deleted: true } : commission,
      );
      CommissionsData = commissions;
      return HttpResponse.json({ status: 200, msg: 'Success', data: CommissionsData });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        error,
      });
    }
  }),
];
