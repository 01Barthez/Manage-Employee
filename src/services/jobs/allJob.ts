import deleteExpiredTokens from "./deleteAllExpiredToken";
import deleteInvalidUser from "./deleteUnverifiedUsers";
import notifiedEmployeeSalary from "./sendEmployeeSalary";
import updateEmployeeStatus from "./updateStatusEmployee";



const startJobs = (): void => {
    deleteInvalidUser.start();
    deleteExpiredTokens.start();
    updateEmployeeStatus.start();
    notifiedEmployeeSalary.start();    
}

export default startJobs