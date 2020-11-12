import datetime, sys

# 未来一年有多少个 13 号是星期五

DAY=13
WEEKDAY=5 

# DAY=28 # 1-28 1-31
# WEEKDAY=7 # 1-7 

def d_2_s(date):
  return datetime.datetime.strftime(date, '%Y-%m-%d')

def get_target(date):
  day = date.day
  if day < DAY:
    return date + datetime.timedelta(days=(DAY-day))
  else:
    next_year = date.year if date.month < 12 else date.year + 1
    next_month = date.month + 1 if date.month < 12 else 1
    # print(next_month, next_year, date)
    return date.replace(day=DAY).replace(month=next_month).replace(year=next_year)

def main(year=None):
  today = datetime.date(year,1,1) if year else datetime.datetime.now()
  after_one_year = (today + datetime.timedelta(days=1)).replace(year=(today.year+1))
  # print(after_one_year)
  time_point = get_target(today)
  count = 0
  while d_2_s(time_point) < d_2_s(after_one_year):
    # print(time_point, time_point.isocalendar())
    weekday = time_point.isocalendar()[2]
    if weekday == WEEKDAY:
      count += 1
      # print(time_point.day, time_point.isocalendar())
    # break
    time_point = get_target(time_point)
  return (year, count)
  

year = int(sys.argv[1]) if len(sys.argv) >= 2 else None
print('year',year)

max_count = 0
max_count_years = []

# for year in range(1921, 2121):
#   y, c = main(year)
#   print(y, c)
#   if c >= max_count:
#     if c == max_count:
#       max_count_years.append(y)
#     else:
#       max_count_years = [y]
#     max_count = c 
# max_count_year = max_count_years[-1]

year = 0
while year <= 1921:
  y, c = main(year)
  if c >= max_count:
    if c == max_count:
      max_count_years.append(y)
    else:
      max_count_years = [y]
    max_count = c 
  year += 1
max_count_year = max_count_years[-1]

print("===")
print(len(max_count_years), max_count_year, max_count_years, max_count)