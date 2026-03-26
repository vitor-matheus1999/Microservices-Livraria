using customers_service.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using customers_service.Application.DTO;

namespace customers_service
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateCustomerAsync([FromBody] CustomerRequestDTO customer)
        {
            try
            {
                var createdCustomer = await _customerService.CreateCustormerAsync(customer);
                return Ok(createdCustomer);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetCustomerByIdAsync([FromQuery] int id)
        {
            try
            {
                var customer = await _customerService.GetCustomerByIdAsync(id);
                if (customer == null)
                    return NotFound();

                return Ok(customer);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }


        [HttpGet("list")]
        public async Task<ActionResult> GetCustomerByIdAsync([FromQuery]int pageSize, [FromQuery] int pageNumber)
        {
            try
            {
                var customers = await _customerService.ListCustomersAsync(pageNumber, pageSize);
                return Ok(customers);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

    }
}
