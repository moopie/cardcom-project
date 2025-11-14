using Microsoft.AspNetCore.Mvc;
using Server.DTOs;

namespace Server.Controllers;

public class HomeController : ControllerBase
{
    [HttpPost("calculate")]
    public IActionResult Calculate([FromBody] CustomerDto customerDto)
    {
        return Ok(new ResponseDto
        {
            NetAmount = customerDto.Amount * 0.98m
        });
    }
}